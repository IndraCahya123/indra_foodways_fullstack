import { useContext } from 'react';
import { Modal} from 'react-bootstrap';

import { ModalContext } from '../../contexts/modalContext';

import Map from '../micro/Map';
import MapLoading from '../loadingState/MapLoading';

function ModalMaps(props) {
    const [state, dispatch] = useContext(ModalContext);
    return (
        <Modal
        key={props.index}
        show={state.showedMaps}
        onHide={() => dispatch({type: "CLOSE_MAP"})}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
        >
            <Modal.Body id={'content-' + props.index} style={{ height: "100%" }}>
                <Map refetch={props.refetch} longLat={props.longLat} totalPrice={props.totalPrice} status={props.status} restaurantLoc={props.partnerLoc} index={ props.index }/>
            </Modal.Body>
        </Modal>
    );
}

export default ModalMaps;