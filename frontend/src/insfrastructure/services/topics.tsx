import axios from "axios";
import { environment } from "../../environments/environment";
import { ListRequest, ListResponse } from "./utils";

export interface Topic {
    topic_id?: number,
    creator_id?: number,
    title: string,
    description: string,
    status?: string,
    created_at?: string,
    session_started_at?: string,
    duration_minutes?: number
};

export interface StartTopicSession {
    session_started_at?: string,
    duration_minutes?: number
};

export interface Vote {
    vote_id?: number,
    user_id?: number,
    topic_id?: number,
    approved: boolean | null
};

export interface TopicResults {
    result: string,
    approved_count: number,
    repproved_count: number
};

export const createTopic = async (data: Topic): Promise<Topic> => {
    const response = await axios.post<Topic>(environment.apiUrl+'/api/topics', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('auth_token')
        }
    });

    if(response.status !== 201) {
        throw Error('error');
    };

    return response.data;
};

export const listTopics = async (params: ListRequest): Promise<ListResponse<Topic>> => {
    const response = await axios.get<ListResponse<Topic>>(environment.apiUrl+'/api/topics', {
        params,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response.data;
};


export const retrieveTopic = async (topic_id: number): Promise<Topic> => {
    const response = await axios.get<Topic>(environment.apiUrl+'/api/topics/'+topic_id, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('auth_token')
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response.data;
};

export const startTopicSession = async (topic_id: number, data: StartTopicSession) => {
    const response = await axios.post<Topic>(environment.apiUrl+'/api/topics/'+topic_id+'/session', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('auth_token')
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response.data;
};

export const voteOnTopic = async (topic_id: number, data: Vote): Promise<Topic> => {
    const response = await axios.post<Topic>(environment.apiUrl+'/api/topics/'+topic_id+'/vote', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('auth_token')
        }
    });

    if(response.status !== 201) {
        throw Error('error');
    };

    return response.data;
};

export const retrieveTopicResults = async (topic_id: number): Promise<TopicResults> => {
    const response = await axios.get<TopicResults>(environment.apiUrl+'/api/topics/'+topic_id+'/result', {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response.data;
};