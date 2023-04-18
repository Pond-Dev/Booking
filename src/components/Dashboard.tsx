import Register from "./Register";
import {
    Container,
    Header,
    Content,
    Navbar,
    Grid,
    Row,
    Col,
    Panel,
} from "rsuite";
import { observer } from "mobx-react-lite";
import Booking from "./Booking";
import { useSeatStore } from "../stores/useSeatStore";

import { toJS } from "mobx";
import Summary from "./Summary";
function Dashboard() {
    const seatStore = useSeatStore();
    const seats = seatStore.getAllSeats();

    let countSeatAvailable = 0;
    seats.forEach((seat) => {
        if (seat.isEmpty === true) {
            countSeatAvailable++;
        }
    });
    return (
        <Container>
            <Header>
                <Navbar appearance="inverse">
                    <Navbar.Brand></Navbar.Brand>
                </Navbar>
            </Header>
            <Content>
                <Grid fluid>
                    <Row className="show-grid">
                        <Col xs={3}>
                            <Register />
                        </Col>
                        <Col xs={3}>
                            <Summary />
                        </Col>
                        <Col xs={12}> </Col>
                        <Col xs={3}>
                            <h5 style={styleButtonToolbar}>
                                Available : {countSeatAvailable}
                            </h5>
                        </Col>
                        <Col xs={3}>
                            <h5 style={styleButtonToolbar}>
                                Total Seats : {seats.length}
                            </h5>
                        </Col>
                    </Row>
                </Grid>
                <Panel
                    shaded
                    bordered
                    style={{
                        margin: "auto",
                        width: "80%",
                        height: "85vh",
                    }}>
                    <Booking />
                </Panel>
            </Content>
        </Container>
    );
}
export default observer(Dashboard);

const styleButtonToolbar = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    margin: "5px",
    padding: "5px",
};
