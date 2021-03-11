import mongoose from "mongoose";
import { Interface } from "readline";


interface IPoint {
  type: string,
  coordinates: [number, number]
}
export interface IWeather{
  location: IPoint,
  forecastTime: Date,
  temperature: number,
  precipitation: number,
}

type PointDocument = mongoose.Document & IPoint;
export type WeatherDocument = mongoose.Document & IWeather;


const pointSchema = new mongoose.Schema<PointDocument>({
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

const WeatherSchema = new mongoose.Schema<WeatherDocument>(
    {
        location: {
            type: pointSchema,
            required: true,
            index: "2dsphere"
        },
        forecastTime: Date,
        temperature: Number,
        precipitation: Number,

    }
);

// userSchema.pre("save", function save(next) {
//     const user = this as UserDocument;
//     if (!user.isModified("password")) { return next(); }
//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) { return next(err); }
//         bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
//             if (err) { return next(err); }
//             user.password = hash;
//             next();
//         });
//     });
// });

// const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
//         cb(err, isMatch);
//     });
// };

// userSchema.methods.comparePassword = comparePassword;

// /**
//  * Helper method for getting user's gravatar.
//  */
// userSchema.methods.gravatar = function (size: number = 200) {
//     if (!this.email) {
//         return `https://gravatar.com/avatar/?s=${size}&d=retro`;
//     }
//     const md5 = crypto.createHash("md5").update(this.email).digest("hex");
//     return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
// };

export const Weather = mongoose.model<WeatherDocument>("Weather", WeatherSchema);

