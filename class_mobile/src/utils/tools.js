import { parse } from 'querystring';


const getPageQuery = () => parse(window.location.href.split('?')[1]);


export {
  getPageQuery
};