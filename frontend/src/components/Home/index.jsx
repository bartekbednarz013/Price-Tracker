import './style.css';
import { Fragment } from 'react';
import UrlInput from '../scraping/UrlInput';
import ScrapedData from '../scraping/ScrapedData';

const Home = () => {
  return (
    <Fragment>
      <UrlInput />
      <ScrapedData />
    </Fragment>
  );
};

export default Home;
