/*
 *
 * TaskPage actions
 *
 */

import { DEFAULT_ACTION, LOAD_TASKS, LOAD_TASKS_SUCCESS, LOAD_TASKS_ERROR, REMOVE_USER_FROM_TASK, UPDATE_TASK_ASSIGNEES } from './constants';
import {ADD_TASK, ADD_TASK_SUCCESS, ADD_TASK_ERROR} from './constants';
import {LOAD_ASSIGNEES, LOAD_ASSIGNEES_SUCCESS, LOAD_ASSIGNEES_ERROR} from './constants';
import {SUBMIT_ASSIGNEES, SUBMIT_ASSIGNEES_SUCCESS, SUBMIT_ASSIGNEES_ERROR} from './constants';

export function defaultAction() {
    return {
        type: DEFAULT_ACTION,
    };
}

export function loadTasks() {
    return {
        type: LOAD_TASKS
    };
}

export function loadTasksSuccess(tasks) {
    return {
        type: LOAD_TASKS_SUCCESS,
        tasks
    };
}

export function loadTasksError(err) {
    return {
        type: LOAD_TASKS_ERROR,
        err
    };
}

export function addTask(name, file) {
  return {
    type: ADD_TASK,
    name,
    file
  };
}

export function addTaskSuccess() {
   return {
       type: ADD_TASK_SUCCESS,
   };
}
  
export function addTaskError(error) {
   return {
       type: ADD_TASK_ERROR,
       error
   };
}

export function loadAssignees() {
  return {
    type: LOAD_ASSIGNEES,
  };
}

export function loadAssigneesSuccess(assignees) {
   return {
       type: LOAD_ASSIGNEES_SUCCESS,
       assignees
   };
}
  
export function loadAssigneesError(error) {
   return {
       type: LOAD_ASSIGNEES_ERROR,
       error
   };
}

export function removeUserFromTask(taskIdx, userId) {
    return {
        type: REMOVE_USER_FROM_TASK,
        taskIdx,
        userId,
    }
}

export function updateTaskAssignees(taskIdx, assignees) {
    return {
        type: UPDATE_TASK_ASSIGNEES,
        taskIdx,
        assignees
    }
}

export function submitAssignees(taskIdx) {
  return {
    type: SUBMIT_ASSIGNEES,
    taskIdx
  };
}

export function submitAssigneesSuccess() {
   return {
       type: SUBMIT_ASSIGNEES_SUCCESS,
   };
}
  
export function submitAssigneesError(error) {
   return {
       type: SUBMIT_ASSIGNEES_ERROR,
       error
   };
}