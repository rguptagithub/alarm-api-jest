import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import AlarmOccurrenceModel, {IAlarmOccurrence} from '../src/models/alarmOccurrence.model'

describe('alarmoccurrence api', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/tets_book_db', { retryWrites: true, w: 'majority' });
  });  

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });  

  // get all alarmoccurrence
  it('should get all alarmoccurrences', async () => {
    const response = await request(app).get('/api/alarmoccurrences');      
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // create a new alarmoccurrence
  it('should create a new alarmoccurrence with status 201', async () => {
    const newAlarmOccurrenceData = { 
      "alarminstanceid":2,
      "alarmpriority": "HIGH",
      "alarmstate":"SHLVD",
      "handle":"Handled"
    };

    const response = await request(app)
      .post('/api/alarmoccurrences')
      .send(newAlarmOccurrenceData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newAlarmOccurrenceData);
  });

  it('should return 400 when alarmoccurrence data is missing', async () => {
    const response = await request(app)
      .post('/api/alarmoccurrences')
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'alarmoccurrence data is required');
  });


  //get an alarmoccurrence
  it('should get an alarmoccurrence with status 200', async () => {
    const existentAlarmOccurrence = 4;

    const getNewAlarmOccurrence = { 
      "alarminstanceid":4,
      "alarmpriority": "HIGH",
      "alarmstate":"SHLVD",
      "handle":"Handled"
    };

    // Create a new alarmoccurrence
    await AlarmOccurrenceModel.create(getNewAlarmOccurrence);

    // Search for the alarmoccurrence
    const response = await request(app).get(`/api/alarmoccurrences/${existentAlarmOccurrence}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(getNewAlarmOccurrence);
  });

  it('should return 404 when alarminstanceid does not exist', async () => {
    const nonExistentAlarminstanceid = 8;

    // Search for a non-existent alarmoccurrence
    const response = await request(app).get(`/api/alarmoccurrences/${nonExistentAlarminstanceid}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'alarmoccurrence not found');
  });

  // update an alarmoccurrence
  it('should update an alarmoccurrence with status 200', async () => {
    const newAlarmOccurrence = { 
      "alarminstanceid": 4,
      "alarmpriority": "HIGH",
      "alarmstate":"SHLVD",
      "handle":"Handled"
    };

    // Create a new alarmoccurrence
    const createdAlarmOccurrence = await AlarmOccurrenceModel.create(newAlarmOccurrence);

    const updatedAlarmOccurrenceData: Partial<IAlarmOccurrence> = {
      alarmpriority: 'MEDIUM',
    };

    // Update an alarmoccurrence
    const response = await request(app)
      .patch(`/api/alarmoccurrences/${createdAlarmOccurrence.alarminstanceid}`)
      .send(updatedAlarmOccurrenceData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.alarmpriority).toBe(updatedAlarmOccurrenceData.alarmpriority);
  });

  it('should return 404 when alarminstanceid to update does not exist', async () => {
    const nonExistentAlarminstanceid = 7;
    const updatedAlarmOccurrence: Partial<IAlarmOccurrence> = {
      handle: 'Pending',
    };

    // Update a non-existent alarmoccurrence
    const response = await request(app)
      .patch(`/api/alarmoccurrences/${nonExistentAlarminstanceid}`)
      .send(updatedAlarmOccurrence)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'alarmoccurrence not found');
  });

  // Delete an alarmoccurrence
  it('should delete an alarmoccurrence with status 200', async () => {
    const newAlarmOccurrence = {
      "alarminstanceid":4,
      "alarmpriority": "HIGH",
      "alarmstate":"SHLVD",
      "handle":"Handled"
    };
  
      // Create a new alarmoccurrence
      await AlarmOccurrenceModel.create(newAlarmOccurrence);

    // Delete the alarmoccurrence
    const response = await request(app).delete(`/api/alarmoccurrences/${newAlarmOccurrence.alarminstanceid}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'alarmoccurrence deleted successfully');
  });

  it('should return 404 when alarmoccurrence to delete does not exist', async () => {
    const nonExistentAlarminstanceid = 7;

    // Delete a non-existent alarmoccurrence
    const response = await request(app).delete(`/api/alarmoccurrences/${nonExistentAlarminstanceid}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'alarmoccurrence not found');
  });

});
