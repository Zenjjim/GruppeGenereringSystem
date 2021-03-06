import axios from 'axios';

import { CreateEventData, IApprovedGroupsData, ICsvData, IFilterData, ILoginCredentials, SignUpData } from './types';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

/**
 * setAuthHeader
 * Set JWT token for authentication
 * @category Utils
 * @param {string} JWT Token
 * @return {null}}
 */

export function setAuthHeader(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
/**
 * sendInvitation
 * Endpoint for sending invitation
 * @category Utils
 * @param {ICsvData[]} csvGroups List of csvGroups
 * @param {string} eventID ID of the current event
 * @return {Promise}
 */
export function sendInvitation(csvGroups: ICsvData[], eventID: string) {
  return axios.post(`/invite/${eventID}`, csvGroups);
}
/**
 * signUp
 * Endpoint for signup
 * @category Utils
 * @param {SignUpData} signUpData Registration data
 * @return {Promise}
 */
export function signUp(signUpData: SignUpData) {
  return axios.post('/register', signUpData);
}
/**
 * generateGroups
 * Endpoint for generating groups
 * @category Utils
 * @param {IFilterData} groupInformation List of participants and filter information
 * @return {Promise}
 */
export function generateGroups(groupInformation: IFilterData) {
  return axios.post('/generate', groupInformation);
}
/**
 * sendGroups
 * Endpoint for sending final groups
 * @category Utils
 * @param {IApprovedGroupsData} groups list og groups
 * @return {Promise}
 */
export function sendGroups(groups: IApprovedGroupsData) {
  return axios.post('/sendgroups', groups);
}
/**
 * login
 * Endpoint for login
 * @category Utils
 * @param {ILoginCredentials} loginCredentials Email and password credentials
 * @return {Promise}
 */
export function login(loginCredentials: ILoginCredentials) {
  return axios.post('/login', loginCredentials);
}
/**
 * verifyToken
 * Endpoint for token verification
 * @category Utils
 * @return {Promise}
 */
export function verifyToken() {
  return axios.get('/verify');
}
/**
 * getUserWithToken
 * Endpoint for getting user with token
 * @category Utils
 * @return {Promise}
 */
export function getUserWithToken() {
  return axios.get('/user');
}
/**
 * deleteEvent
 * Endpoint for deleting event
 * @category Utils
 * @param {string} eventID Id of event to delete
 * @return {Promise}
 */
export function deleteEvent(eventID: string) {
  return axios.delete(`/event/${eventID}`);
}
/**
 * getEvents
 * Endpoint for getting all events for user
 * @category Utils
 * @return {Promise}
 */
export function getEvents() {
  return axios.get('/event');
}
/**
 * createEvent
 * Endpoint for creating event
 * @category Utils
 * @param {CreateEventData} eventData Event data for creating event
 * @return {Promise}
 */
export function createEvent(eventData: CreateEventData) {
  return axios.post('/event', eventData);
}
/**
 * updateEvent
 * Endpoint for update event
 * @category Utils
 * @param {CreateEventData} eventData Event data for updating event
 * @param {string} eventID Id of event to be updated
 * @return {Promise}
 */
export function updateEvent(eventData: CreateEventData, eventID: string) {
  return axios.put(`/event/${eventID}`, eventData);
}
