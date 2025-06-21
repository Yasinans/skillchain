export interface ConfirmationModalData {
    isOpen: boolean,
    type: string,
    title: string,
    message: string,
    actionType: string,
    action: () => void,
}