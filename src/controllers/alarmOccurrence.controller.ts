import { Request, Response } from 'express';
import AlarmOccurrenceModel, {IAlarmOccurrence} from '../models/alarmOccurrence.model'

export const getAllAlarmOccurrences = async (req: Request, res: Response): Promise<void> => {
    try {
        const alarmOccurrences: IAlarmOccurrence[] = await AlarmOccurrenceModel.find();
        res.status(200).json(alarmOccurrences);
    } catch (err) {
        res.status(500).json({ error: 'failed to retrieve alarmOccurrences' });
    }
};

export const createAlarmOccurrence = async (req: Request, res: Response): Promise<void> => {
    try {
        const { alarminstanceid, alarmpriority, alarmstate, handle }: IAlarmOccurrence = req.body;

        if (!alarminstanceid || !alarmpriority || !alarmstate || !handle) {
            res.status(400).json({ error: 'alarmoccurrence data is required' });
            return;
          }
        
        const newAlarmOccurrence: IAlarmOccurrence = new AlarmOccurrenceModel({ alarminstanceid, alarmpriority, alarmstate, handle });
        await newAlarmOccurrence.save()

        res.status(201).json(newAlarmOccurrence); 
    } catch (err) {
        res.status(500).json({ error: 'failed to create a new alarmoccurrence' });
    }
};

export const getAlarmOccurrence = async (req: Request, res: Response): Promise<void> => {
    try {
    const alarminstanceid = req.params.alarminstanceid;

    if (!alarminstanceid) {
        res.status(400).json({ error: 'alarminstanceid is required' });
        return;
    }

    const alarmOccurrence: IAlarmOccurrence | null = await AlarmOccurrenceModel.findOne({ alarminstanceid });

    if (!alarmOccurrence) {
        res.status(404).json({ error: 'alarmoccurrence not found' });
        return;
    }  
    res.status(200).json(alarmOccurrence);
    } catch (err) {
    res.status(500).json({ error: 'failed to retrieve alarmoccurrence' });
    }
  };

export const updateAlarmOccurrence = async (req: Request, res: Response): Promise<void> => {
    try {
        const alarminstanceid = req.params.alarminstanceid;
        const updates: Partial<IAlarmOccurrence> = req.body;

        if (!alarminstanceid) {
            res.status(400).json({ error: 'alarminstanceid is required' });
            return;
        }

        const updatedAlarmOccurrence: IAlarmOccurrence | null = await AlarmOccurrenceModel.findOneAndUpdate({ alarminstanceid }, updates, {
        new: true,
        });

        if (!updatedAlarmOccurrence) {
            res.status(404).json({ error: 'alarmoccurrence not found' });
            return;
        }

        res.json(updatedAlarmOccurrence);
    } catch (err) {
        res.status(500).json({ error: 'failed to update alarmoccurrence' });
    }
};

export const deleteAlarmOccurrence = async (req: Request, res: Response): Promise<void> => {
    try {
        const alarminstanceid = req.params.alarminstanceid;

        if (!alarminstanceid) {
            res.status(400).json({ error: 'alarminstanceid is required' });
            return;
        }

        const deletedAlarmOccurrence = await AlarmOccurrenceModel.findOneAndDelete({ alarminstanceid });

        if (!deletedAlarmOccurrence) {
            res.status(404).json({ error: 'alarmoccurrence not found' });
            return;
        }

        res.status(201).json({ message: 'alarmoccurrence deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'failed to delete alarmoccurrence' });
    }
};
