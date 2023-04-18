import {
    Drawer,
    ButtonToolbar,
    Button,
    Form,
    Schema,
    Modal,

} from "rsuite";
import { useState } from "react";
import { formValueType } from "../stores/useUserStore";
import { useUserStore } from "../stores/useUserStore";
import { observer } from "mobx-react-lite";
import { useSeatStore } from "../stores/useSeatStore";
import { toJS } from "mobx";
function Register() {
    const userStore = useUserStore();
    const seatStore = useSeatStore();
    const isCanBookingSeat = seatStore.getBookingSeat();
    const [isClickRegisterButton, setIsClickRegisterButton] =
        useState<boolean>(false);
    const [isClickConfirmButton, setIsClickConfirmButton] =
        useState<boolean>(false);

    const [formValue, setFormValue] = useState<formValueType | null>(null);

    const model = Schema.Model({
        firstName: Schema.Types.StringType().isRequired(
            "This field is required."
        ),
        lastName: Schema.Types.StringType().isRequired(
            "This field is required."
        ),
        phone: Schema.Types.StringType().isRequired("This field is required."),
    });
    let countSeatAvailable = 0;
    seatStore.getAllSeats().forEach((seat) => {
        if (seat.isEmpty === true) {
            countSeatAvailable++;
        }
    });

    const onCloseRegister = () => {
        setFormValue(null);
        setIsClickRegisterButton(false);
    };

    const onCancel = () => {
        setFormValue(null);
        setIsClickRegisterButton(false);
    };
    const onConfirm = () => {
        if (formValue?.firstName && formValue.lastName && formValue.phone) {
            userStore.setCurrentUser(formValue);
            seatStore.setBookingSeat(true);
            setIsClickRegisterButton(false);
        }
    };

    const onFormChange = (event: any) => {
        setFormValue(event);
    };

    const onCloseModal = () => { };
    const onSubmitFormModal = () => {
        const selectSeat: number[] = [];
        if (userStore.getCurrentUser()) {
            // เลือก seat id ให้กับ current user
            const newSeats = seatStore.getAllSeats().map((seat) => {
                if (seat.canEdit === true && seat.isEmpty === false) {
                    selectSeat.push(seat.id);
                }
                // ถ้าเลือกแล้วจะไม่สามารถเลือกซ้ำได้อีก
                if (seat.isEmpty === false) {
                    return { ...seat, canEdit: false };
                } else {
                    return seat;
                }
            });
            seatStore.setAllSeats(newSeats);

            userStore.addNewUser({
                ...userStore.getCurrentUser(),
                selectSeats: selectSeat.join(','),
            });

        }
        if (userStore.getCurrentEditUser()) {
            // เลือก seat id ให้กับ current edit user
            const newSeats = seatStore.getAllSeats().map((seat) => {

                if (seat.canEdit === true && seat.isEmpty === false) {
                    selectSeat.push(seat.id);
                }
                if (seat.isEmpty === false) {
                    return { ...seat, canEdit: false };
                } else {
                    return seat;
                }
            });

            seatStore.setAllSeats(newSeats);
            //update user
            const updateUser = userStore.getAllUser().map(user => {
                if (user.firstName === userStore.getCurrentEditUser().firstName) {
                    return { ...user, selectSeats: selectSeat.join(',') }
                } else {
                    return user
                }
            })

            userStore.setAllUser(updateUser)
            userStore.setCurrentEditUser(undefined)
        }
        setIsClickConfirmButton(false);
        seatStore.setBookingSeat(false);

    };
    const onCloseFormModal = () => {
        setIsClickConfirmButton(false);
    };
    return (
        <div style={styleCenter}>
            <ButtonToolbar style={styleButtonToolbar}>
                <div>
                    {isCanBookingSeat ? (
                        <Button
                            appearance="primary"
                            onClick={() => setIsClickConfirmButton(true)}>
                            Confirm
                        </Button>
                    ) : (
                        <Button
                            appearance="primary"
                            onClick={() => setIsClickRegisterButton(true)}
                            disabled={countSeatAvailable === 0}
                        >
                            Register

                        </Button>
                    )}
                </div>
            </ButtonToolbar>

            <Drawer
                open={isClickRegisterButton}
                onClose={onCloseRegister}
                backdrop={true}
                placement={"left"}
                size={"xs"}>
                <Drawer.Header>
                    <Drawer.Title>Register</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <Form fluid onChange={onFormChange} model={model}>
                        <Form.Group controlId="firstName">
                            <Form.ControlLabel>First Name</Form.ControlLabel>
                            <Form.Control name="firstName" />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.ControlLabel>Last Name</Form.ControlLabel>
                            <Form.Control name="lastName" />
                        </Form.Group>
                        <Form.Group controlId="phone">
                            <Form.ControlLabel>Phone Number</Form.ControlLabel>
                            <Form.Control name="phone" />
                        </Form.Group>
                        <Form.Group>
                            <ButtonToolbar>
                                <Button
                                    type="submit"
                                    appearance="primary"
                                    onClick={onConfirm}>
                                    Submit
                                </Button>
                                <Button appearance="default" onClick={onCancel}>
                                    Cancel
                                </Button>
                            </ButtonToolbar>
                        </Form.Group>
                    </Form>
                </Drawer.Body>
            </Drawer>
            <Modal
                open={isClickConfirmButton}
                onClose={onCloseModal}
                overflow={true}>
                <Modal.Header>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button onClick={onSubmitFormModal} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={onCloseFormModal} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default observer(Register);

const styleCenter: any = {
    alignItems: "center",
};

const styleButtonToolbar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "5px",
};
