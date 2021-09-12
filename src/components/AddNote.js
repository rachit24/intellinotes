import React, {useContext, useState} from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const{addNote} = context;
    
    const [note, setNote] = useState({title: "", description: "", tag:""});

    const handleClick=(e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "", tag:""});
        props.showAlert("Added Successfully","success");
    }
    const onChange=(e)=>{
        setNote({...note, [e.target.name]:e.target.value})
    }
    return (
        <div>
            <div className="container my-3">
            <h1>Add a note</h1>
                <form className="my-3">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" value={note.title} id="title" onChange={onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" value={note.description} name="description" id="description" onChange={onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tags</label>
                        <input type="text" className="form-control" value={note.tag} name="tag" id="tag" onChange={onChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>          
            </div>
        </div>
    )
}

export default AddNote
