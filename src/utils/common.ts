import { v4 as uuid } from 'uuid';

export const generateRecordId = () => {
  return uuid();
};

export const getCurrentUTCTimeStamp = () => {
  return Date.now();
};

export const  getRandomInt=(min:number, max:number) =>{
  return Math.floor(Math.random() * (max - min)) + min;
}
