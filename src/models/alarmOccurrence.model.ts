import mongoose, { Schema, Document } from 'mongoose';

export interface IAlarmOccurrence extends Document {
  alarminstanceid: Number;
  alarmpriority: string;
  alarmstate: string;
  handle: string;
}

const alarmOccurrenceSchema: Schema = new mongoose.Schema ({
  alarminstanceid: {
      type: Number,
      required: true      
  },
  alarmpriority: {
      type: String,
      required: true
  },
  alarmstate: {
      type: String,
      required: true
  },
  handle: {
      type: String,
      required: true
  }
});

export default mongoose.model<IAlarmOccurrence>('AlarmOccurrence', alarmOccurrenceSchema);