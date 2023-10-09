from sqlalchemy.orm import Session
from database.models import ItemModel
from schemas.item import ItemCreateSchema


async def create_item(db: Session, user_id: int, item: ItemCreateSchema) -> ItemModel:
    item_instance = ItemModel(
        user_id=user_id,
        name=item.name,
        shop=item.shop,
        url=item.url,
        price=item.price,
        expected_price=item.expected_price,
        currency=item.currency,
        tracked=item.tracked
    )
    db.add(item_instance)
    db.commit()
    db.refresh(item_instance)
    return item_instance


async def read_item(db: Session, item_id: int) -> ItemModel:
    return db.query(ItemModel).get(item_id)


async def read_all_items(db: Session) -> list[ItemModel]:
    return db.query(ItemModel).all()


async def delete_item(db: Session, item_id: int) -> ItemModel:
    item = db.query(ItemModel).get(item_id)
    db.delete(item)
    db.commit()
    return item


async def update_price(db: Session, item_id: int, new_price: float) -> ItemModel:
    item = db.query(ItemModel).get(item_id)
    item.previous_price= item.price
    item.price=new_price
    db.commit()
    db.refresh(item)
    return item


async def update_expected_price(db: Session, item_id: int, expected_price: float) -> ItemModel:
    db.query(ItemModel).filter(ItemModel.id == item_id).update({"expected_price": expected_price})
    db.commit()
    item = db.query(ItemModel).get(item_id)
    return item


async def update_tracking_status(db: Session, item_id: int, tracked: bool) -> ItemModel:
    item = db.query(ItemModel).get(item_id)
    item.tracked = tracked
    db.commit()
    db.refresh(item)
    return item


async def read_all_user_items(db: Session, user_id: int) -> list[ItemModel]:
    return db.query(ItemModel).filter(ItemModel.user_id == user_id).all()


async def check_if_already_exist(db: Session, url:str, user_id) -> ItemModel:
    return db.query(ItemModel).filter(ItemModel.url == url, ItemModel.user_id == user_id).first()