import { Table, Button, Form, ButtonToolbar, Drawer } from "rsuite";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { useSeatStore } from "../stores/useSeatStore";

function Summary() {
    const { Column, HeaderCell, Cell } = Table;
    const [sortColumn, setSortColumn] = useState<any>();
    const [sortType, setSortType] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isClickViewButton, setIsClickViewButton] =
        useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>();
    const userStore = useUserStore();
    const seatStore = useSeatStore()

    const data = userStore.getAllUserFilter();

    const getUser = () => {
        let sortedData = data.slice();
        if (sortColumn && sortType) {

            sortedData = sortedData.sort((a: any, b: any) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                if (typeof x === "string") {
                    x = x.charCodeAt(0);
                }
                if (typeof y === "string") {
                    y = y.charCodeAt(0);
                }
                if (sortType === "asc") {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }
        return sortedData;
    };

    const handleSortColumn = (sortColumn: any, sortType: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    const onSearchChange = (value: any) => {
        setSearchValue(value.search);
    };

    const onClickSearch = () => {
        setLoading(true);
        userStore.filterUser(searchValue);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const onCloseView = () => {
        setIsClickViewButton(false)
    }

    const onClickEdit = (rowData: any) => {
        userStore.setCurrentEditUser(rowData)
        seatStore.setBookingSeat(true)
        const selectOldSeats = rowData.selectSeats
        // ลบ seat id ที่ได้เลือกไปแล้ว
        const removeOldSeats = seatStore.getAllSeats().map((seat) => {
            if (selectOldSeats.includes(seat.id)) {
                return { ...seat, canEdit: true, isEmpty: true }
            }
            else {
                return seat
            }
        });
        seatStore.setAllSeats(removeOldSeats);
        setIsClickViewButton(false)
    }


    return (
        <>
            <ButtonToolbar style={styleButtonToolbar}>
                <div>
                    <Button
                        disabled={seatStore.getBookingSeat()}
                        appearance="primary"
                        onClick={() => setIsClickViewButton(true)}>
                        View
                    </Button>
                </div>
            </ButtonToolbar>
            <Drawer
                open={isClickViewButton}
                onClose={onCloseView}
                backdrop={true}
                placement={"left"}
                size={"full"}>
                <Drawer.Header>
                    <Drawer.Title>List</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <div className="d-flex justify-content-center">
                        <Form onChange={onSearchChange}>
                            <Form.Group controlId="search">
                                <Form.Control
                                    type="text"
                                    name="search"
                                    placeholder="Search"
                                    defaultValue={userStore.getSearchName()}
                                />
                                <Button appearance="primary" onClick={onClickSearch} style={{ marginLeft: '5px' }}>
                                    Search
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>

                    <Table
                        height={400}
                        data={getUser()}
                        autoHeight={true}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}>
                        <Column flexGrow={2} sortable={true}>
                            <HeaderCell>First Name</HeaderCell>
                            <Cell dataKey="firstName" />
                        </Column>
                        <Column flexGrow={2} sortable={true}>
                            <HeaderCell>Last Name</HeaderCell>
                            <Cell dataKey="lastName" />
                        </Column>
                        <Column flexGrow={2} sortable={true}>
                            <HeaderCell>Phone</HeaderCell>
                            <Cell dataKey="phone" />
                        </Column>
                        <Column flexGrow={2} sortable={true}>
                            <HeaderCell>Seat NO.</HeaderCell>
                            <Cell dataKey="selectSeats" />
                        </Column>
                        <Column width={100} align="center" fixed="right">
                            <HeaderCell>Edit</HeaderCell>
                            <Cell style={{ padding: "6px" }}>
                                {(rowData) => (
                                    <Button
                                        appearance="link"
                                        onClick={() => onClickEdit(rowData)}>
                                        Edit
                                    </Button>
                                )}
                            </Cell>
                        </Column>
                    </Table>
                </Drawer.Body>
            </Drawer>


        </>
    );
}
export default observer(Summary);

const styleButtonToolbar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "5px",
};
