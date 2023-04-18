import { createContext, useContext } from "react";
import { observable, action, makeAutoObservable } from "mobx";
class SeatStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable private seatsArray: SeatType[] = [
        {
            id: 1,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 2,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 3,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 4,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 5,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 6,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 7,
            isEmpty: true,
            canEdit: true,
        },
        {
            id: 8,
            isEmpty: true,
            canEdit: true,
        },
    ];
    @action getAllSeats = () => {
        return this.seatsArray;
    };
    @action setAllSeats = (seats: SeatType[]) => {
        this.seatsArray = seats;
    };

    @observable private isCanBookingSeat: boolean = false;

    @action getBookingSeat = () => {
        return this.isCanBookingSeat;
    };
    @action setBookingSeat = (isBooking: boolean) => {
        this.isCanBookingSeat = isBooking;
    };


}

const SeatStoreContext = createContext(new SeatStore());

export const useSeatStore = () => useContext(SeatStoreContext);

export type SeatType = {
    id: number;
    isEmpty: boolean;
    canEdit: boolean;
};
