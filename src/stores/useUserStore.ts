import { createContext, useContext } from "react";
import { observable, action, makeAutoObservable } from "mobx";

class UserStore {
    constructor() {
        makeAutoObservable(this);
    }
    @observable private userArray: formValueType[] = [

    ];
    @action getAllUser = () => {
        return this.userArray;
    };

    @action setAllUser = (allUser: formValueType[]) => {
        this.userArray = allUser;
        this.filterUser(this.searchName)

    };

    @action addNewUser = (user: formValueType) => {
        this.userArray.push(user);
        this.filterUser(this.searchName)
        this.setCurrentUser(undefined)
    };

    @observable private userFilterArray: formValueType[] = this.userArray;


    @action getAllUserFilter = () => {
        return this.userFilterArray;
    };

    @action filterUser = (searchName: string | undefined) => {
        if (searchName) {
            this.searchName = searchName
            this.userFilterArray = this.userArray.filter(
                (obj) =>
                    obj.firstName.includes(searchName) ||
                    obj.lastName.includes(searchName) ||
                    obj.phone.includes(searchName)
            );
        } else {
            this.userFilterArray = this.userArray;
        }
    };

    @observable private currentUser: any;

    @action getCurrentUser = () => {
        return this.currentUser;
    };
    @action setCurrentUser = (user: any) => {
        this.currentUser = user;
    };

    @observable private currentEditUser: any;
    @action getCurrentEditUser = () => {
        return this.currentEditUser;
    };
    @action setCurrentEditUser = (user: any) => {
        this.currentEditUser = user;
    };


    @observable private searchName: string = '';
    @action getSearchName = () => {
        return this.searchName
    };
}

const UserStoreContext = createContext(new UserStore());

export const useUserStore = () => useContext(UserStoreContext);

export type formValueType = {
    firstName: string;
    lastName: string;
    phone: string;
    selectSeats: string;
};
