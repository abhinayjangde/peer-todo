import mongoose from "mongoose";

const db = () => {
    mongoose
        .connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("database connected!");
        })
        .catch((err) => {
            console.log(`Error while connectiong to database ${err}`);
        });
};

export default db;
