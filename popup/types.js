export const RequestStatus = {
    NONE: 0,
    HALTED: 1,
    INPROGRESS: 2,
    COMPLETED: 3
}

export const ActionButtonView = {
    [RequestStatus.NONE]: {
        className: 'btn-blue',
        name: 'Start Connecting'
    },
    [RequestStatus.HALTED]: {
        className: 'btn-blue',
        name: 'Resume Connecting'
    },
    [RequestStatus.INPROGRESS]: {
        className: 'btn-red',
        name: 'Stop Connecting'
    },
    [RequestStatus.COMPLETED]: {
        className: 'btn-disabled',
        name: 'Start Connecting'
    }
}