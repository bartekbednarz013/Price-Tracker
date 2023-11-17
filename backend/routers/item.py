from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from schemas.item import ItemSchema, ItemCreateSchema, AddItemResponseSchema
from database.models import UserModel
from crud.item import (
    create_item,
    read_all_items,
    read_item,
    delete_item,
    update_price,
    update_expected_price,
    update_tracking_status,
    read_all_user_items,
    check_if_already_exist,
)
from crud.user import increase_user_tracked_items, decrease_user_tracked_items
from scraping.scrapers import get_scraper

router = APIRouter(prefix="/items", tags=["items"])


@router.post("", response_model=AddItemResponseSchema, status_code=status.HTTP_201_CREATED)
async def add_item(
    item: ItemCreateSchema,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    existing_item = await check_if_already_exist(db, item.url, current_user.id)
    if existing_item:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already have this item on your list.")
    if item.tracked and current_user.tracked_items >= current_user.tracked_items_limit:
        item.tracked = False
        detail = "Item added to your list, but won't be tracked - you've already reached limit of tracked items."
    else:
        detail = "Item successfully added to your list!"
    created_item = await create_item(db, current_user.id, item)
    if created_item.tracked:
        await increase_user_tracked_items(db, current_user.id)
    return {
        "notification": {"status_code": status.HTTP_201_CREATED, "detail": detail, "duration": 6000},
        "item": created_item,
    }


@router.delete("/{item_id}", response_model=ItemSchema)
async def remove_item(
    item_id: int,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    item = await read_item(db, item_id)
    if item.user_id is not current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete other user's item.")
    item = await delete_item(db, item_id)
    if item.tracked:
        await decrease_user_tracked_items(db, current_user.id)
    return item


@router.get("", response_model=list[ItemSchema])
async def get_all_my_items(
    current_user: Annotated[UserModel, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]
):
    items = await read_all_user_items(db, current_user.id)
    if not items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You don't have any items yet.")
    return items


# @router.get("/all", response_model=list[ItemSchema])
# def get_all_items(db: Annotated[Session, Depends(get_db)]):
#     items = read_all_items(db)
#     if items == []:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="There is no items.")
#     return items


@router.get("/{item_id}", response_model=ItemSchema)
async def get_item(
    item_id: int,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    item = await read_item(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item.user_id is not current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot get other user's item.")
    return item


@router.post("/{item_id}/update-price", response_model=ItemSchema)
async def check_and_update_price(
    item_id: int,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    item = await read_item(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item.user_id is not current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot operate on other user's item")
    scraper = get_scraper(item.url)
    try:
        result = await scraper(item.url, price_only=True)
        current_price = result["price"]
        if item.price != current_price:
            item = await update_price(db, item_id, current_price)
        return item
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem with scraper occured. Try again.")


@router.post("/{item_id}/expected-price", response_model=ItemSchema)
async def edit_expected_price(
    item_id: int,
    expected_price: float,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    item = await read_item(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item.user_id is not current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot edit other user's item")
    if item.expected_price != expected_price:
        item = await update_expected_price(db, item_id, expected_price)
    return item


@router.post("/{item_id}/tracking-status", response_model=ItemSchema)
async def edit_tracking_status(
    item_id: int,
    tracked: bool,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if tracked and current_user.tracked_items >= current_user.tracked_items_limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot track this item - you've already reached limit of tracked items.",
        )
    item = await read_item(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item.user_id is not current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot edit other user's item")
    if item.tracked == tracked:
        return item
    item = await update_tracking_status(db, item_id, tracked)
    if tracked:
        await increase_user_tracked_items(db, current_user.id)
    else:
        await decrease_user_tracked_items(db, current_user.id)
    return item
