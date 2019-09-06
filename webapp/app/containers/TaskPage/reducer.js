/*
 *
 * TaskPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, LOAD_TASKS, LOAD_TASKS_SUCCESS, LOAD_TASKS_ERROR, UPDATE_TASK_ASSIGNEES, REMOVE_USER_FROM_TASK } from './constants';
import { LOAD_ASSIGNEES, LOAD_ASSIGNEES_SUCCESS, LOAD_ASSIGNEES_ERROR } from './constants';
import { SUBMIT_ASSIGNEES, SUBMIT_ASSIGNEES_SUCCESS, SUBMIT_ASSIGNEES_ERROR } from './constants';
import { ADD_TASK, ADD_TASK_SUCCESS, ADD_TASK_ERROR } from './constants';
import { SIGNIN_SUCCESS } from '../App/constants';

export const initialState = {
    tasks: {
        data: false,
        loading: false,
        error: false,
    },
    addTask: {
        loading: false,
        error: false,
    },
    assignees: {
        data: false,
        loading: false,
        error: false
    },
    submitAssignees: {
        loading: false,
        error: false,
    }
};

/* eslint-disable default-case, no-param-reassign */
const taskPageReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SIGNIN_SUCCESS:
                draft.tasks.data = false;
                draft.tasks.loading = false;
                draft.tasks.error = false;
                break
            case LOAD_TASKS:
                draft.tasks.loading = true;
                break;
            case LOAD_TASKS_SUCCESS:
                draft.tasks.loading = false;
                draft.tasks.data = action.tasks;
                break;
            case LOAD_TASKS_ERROR:
                draft.tasks.loading = false;
                draft.tasks.error = action.err;
                break
            case ADD_TASK:
                draft.addTask.loading = true;
                draft.addTask.error = true;
                break
            case ADD_TASK_SUCCESS:
                draft.addTask.loading = false;
                draft.addTask.error = false;
                break
            case ADD_TASK_ERROR:
                draft.addTask.loading = false;
                draft.addTask.error = action.error;
                break
            case LOAD_ASSIGNEES:
                draft.assignees.loading = true;
                draft.assignees.error = false;
                break
            case LOAD_ASSIGNEES_SUCCESS:
                draft.assignees.loading = false;
                draft.assignees.error = false;
                draft.assignees.data = action.assignees;
                break
            case LOAD_ASSIGNEES_ERROR:
                draft.assignees.loading = false;
                draft.assignees.error = action.error;
                break
            case UPDATE_TASK_ASSIGNEES:
                {
                    console.log(action.assignees)
                    if (action.taskIdx < 0 || action.taskIdx > draft.tasks.length) {
                        break
                    }
                    let task = draft.tasks.data[action.taskIdx];
                    let assignees = [...action.assignees];
                    // let current_assignees = task.assignees.map(u => u.id)
                    task.assignees = []
                    let current_assignees = new Set([])

                    assignees.forEach(u => {
                        if (current_assignees.has(u.id)) {
                            // if any item appears twice, you should remove it
                            // the task.assignees and whole list of assignees are fetched separately,
                            // and select will falsely treat a same user as different, (reference issue)
                            task.assignees = task.assignees.filter(assignee => assignee.id != u.id)
                            current_assignees.delete(u.id)
                        } else {
                            task.assignees.push(u)
                            current_assignees.add(u.id)
                        }
                    })

                    // assignees.forEach(u => {
                    //     if (!current_assignees.includes(u.id)) {
                    //         task.assignees.push(u)
                    //     }
                    // })

                    // if (action.taskIdx < 0 || action.taskIdx > draft.tasks.length) {
                    //     break
                    // }
                    // let task = draft.tasks.data[action.taskIdx];
                    // let assignees = [...action.assignees];
                    // let current_assignees = task.assignees.map(u => u.id)
                    // assignees.forEach(u => {
                    //     if (!current_assignees.includes(u)) {
                    //         task.assignees.push({ 'id': u })
                    //     }
                    // })

                }
                break
            case REMOVE_USER_FROM_TASK:
                {
                    if (action.taskIdx < 0 || action.taskIdx > draft.tasks.length) {
                        break
                    }
                    let task = draft.tasks.data[action.taskIdx];
                    task.assignees = task.assignees.filter(u => u.id !== action.userId);
                }
                break

            case SUBMIT_ASSIGNEES:
                draft.submitAssignees.loading = true;
                draft.submitAssignees.error = false;
                break
            case SUBMIT_ASSIGNEES_SUCCESS:
                draft.submitAssignees.loading = false;
                draft.submitAssignees.error = false;
                break
            case SUBMIT_ASSIGNEES_ERROR:
                draft.submitAssignees.loading = false;
                draft.submitAssignees.error = action.error;
                break

            case DEFAULT_ACTION:
                break;
        }
    });

export default taskPageReducer;
