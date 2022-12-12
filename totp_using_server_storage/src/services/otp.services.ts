import { ITempUserData } from "../models/tempUserData.model";

import { TempUserDataMongo } from "../schema/tempUserData.schema";

// this service will write user data in database 
export const createOtp = async (tempUserData: ITempUserData) => {
  const tempData = new TempUserDataMongo({
    ...tempUserData,
    expireAt: Date.now() + 1000 * 60 * 30,
  });
  return tempData.save();
};

// this service will check whether user data exist in database or not
export const ifEmailExists = async (email: string) => {
  const existOrNot = await TempUserDataMongo.findOne({ email });

  const userEmail = existOrNot?.email || "";
    if (userEmail === email) {
      return true;
    }

    return false;
};

// this service will return single user data object from database find by Email
export const validateOtp = async (email: string) => {
  const data = await TempUserDataMongo.findOne({ email });

  return data;
};


// this service will check whether user already verified ot not
export const checkFlag = async (email: string) => {
  const check = await TempUserDataMongo.findOne({ email });

  return check;
};

// this service will update the Flag of verification to the True
export const updateFlag = async (email: string, flag: boolean) => {
  const updateFlag = await TempUserDataMongo.findOneAndUpdate(
    { email },
    { flag },
    { new: true }
  );
  return updateFlag;
};
