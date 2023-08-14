import { Router } from 'express';
import { getAllAlarmOccurrences, createAlarmOccurrence, getAlarmOccurrence, updateAlarmOccurrence, deleteAlarmOccurrence }  from '../controllers/alarmOccurrence.controller';

const router: Router = Router();

router.get('/alarmoccurrences', getAllAlarmOccurrences);
router.post('/alarmoccurrences',  createAlarmOccurrence);
router.get('/alarmoccurrences/:alarminstanceid', getAlarmOccurrence);
router.patch('/alarmoccurrences/:alarminstanceid', updateAlarmOccurrence);
router.delete('/alarmoccurrences/:alarminstanceid', deleteAlarmOccurrence);

export default router;
