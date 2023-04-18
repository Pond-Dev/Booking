import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Avatar } from "rsuite";
import CheckOutlineIcon from "@rsuite/icons/CheckOutline";
import CloseOutlineIcon from "@rsuite/icons/CloseOutline";
import { useUserStore } from "../stores/useUserStore";

import { observer } from "mobx-react-lite";
import { useSeatStore } from "../stores/useSeatStore";
import { toJS } from "mobx";
function Booking() {

    const seatStore = useSeatStore();
    const isCanBookingSeat = seatStore.getBookingSeat();
    const seats = seatStore.getAllSeats();



    // console.log((toJS(userStore.getAllUser())))
    const onClickAvatar = (data: {
        id: number;
        isEmpty: boolean;
        canEdit: boolean;
    }) => {
        if (data.canEdit) {
            const newSeats = seats.map((seat) => {
                if (seat.id === data.id) {
                    return { ...seat, isEmpty: !data.isEmpty };
                } else {
                    return seat;
                }
            });
            seatStore.setAllSeats(newSeats);
        }
    };
    return (
        <>
            <Grid fluid style={{ textAlign: "center" }}>
                <Row>
                    {seats.map((data) => {
                        return (
                            <Col xs={3} key={data.id}>
                                {data.isEmpty ? (
                                    <CheckOutlineIcon
                                        onClick={() => onClickAvatar(data)}
                                        style={{
                                            color: isCanBookingSeat
                                                ? "green"
                                                : "gray",
                                            opacity: isCanBookingSeat ? 1 : 0.5,
                                            pointerEvents: isCanBookingSeat
                                                ? "auto"
                                                : "none",
                                        }}
                                    />
                                ) : (
                                    <CloseOutlineIcon
                                        onClick={() => onClickAvatar(data)}
                                        style={{
                                            color: isCanBookingSeat
                                                ? "red"
                                                : "gray",
                                            opacity: isCanBookingSeat ? 1 : 0.5,
                                            pointerEvents: isCanBookingSeat
                                                ? "auto"
                                                : "none",
                                        }}
                                    />
                                )}
                            </Col>
                        );
                    })}
                </Row>
            </Grid>
        </>
    );
}
export default observer(Booking);

const styleAvatar: any = {
    cursor: "pointer",
};
