import PaperClip from '../../images/paper_clip.png';

function FileButton(props) {
    return (
        <>
            <input type="file" id="actual-btn" name="imgFile" onChange={e => props.onChange(e)} hidden />
            <label id="file-button" for="actual-btn">
                Attach File
                <img
                    src={PaperClip}
                    alt="File Upload"
                    height="24px"
                    width="24px"
                    style={{ marginLeft: 10 }}
                />
            </label>
        </>
    );
    
}

export default FileButton
