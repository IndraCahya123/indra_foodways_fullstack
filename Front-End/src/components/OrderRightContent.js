import toRupiah from '@develoka/angka-rupiah-js';

function OrderRightContent(props) {
    const ongkir = () => {
        if (props.total === 0) {
            return 0
        } else {
            return 12000
        }
    };
    const totalAll = props.totalPrice + ongkir();
    return (
        <>
            <div className="sub-total d-flex justify-content-between">
                <span>Subtotal</span>
                <span style={{ color: "red" }}>{ toRupiah(props.totalPrice, {formal: false}) }</span>
            </div>
            <div className="quantity d-flex justify-content-between">
                <span>Qty</span>
                <span>{ props.total }</span>
            </div>
            <div className="Ongkir d-flex justify-content-between">
                <span>Ongkir</span>
                <span style={{ color: "red" }}>{ toRupiah(ongkir(), {formal: false}) }</span>
            </div>
            <hr />
            <div className="total-all-product d-flex justify-content-between">
                <span>Total</span>
                <span style={{ color: "red" }}>{ toRupiah(totalAll, {formal: false}) }</span>
            </div>
        </>
    );
}

export default OrderRightContent;