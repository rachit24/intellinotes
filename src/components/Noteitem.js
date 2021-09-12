import React, {useContext} from 'react'
import noteContext from '../context/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const {deleteNote} = context;
    const {note, updateNote} = props;
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <center><h5 className="card-title">{note.title}</h5></center>
                    <center><p className="card-text">{note.description}</p></center>
                    <center>
                        <i className="fas fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id); props.showAlert("Deleted Successfully","success");}}></i>
                        <i className="fas fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
                    </center>
                </div>
            </div>
        </div>
    )
}

export default Noteitem
