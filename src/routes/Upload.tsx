import React from "react";

function Upload() {
    return (
        <div>
            <form className="flex flex-col justify-center p-4 bg-zinc-700 m-4 rounded max-w-xl" onSubmit={(e) => {e.preventDefault(); const data = new FormData(e.target); data.forEach(item => console.log(item));}}>
                <div className="flex my-2 flex-col">
                    <label>Image</label>
                    <input type="file" id="asset" name="asset" onChange={(e) => {console.log(e.target[0].files)}}/>
                </div>
                <div className="flex my-2 flex-col">
                    <label>Price</label>
                    <input type="number" id="price" name="price"/>
                </div>
                <div className="flex my-2 flex-col">
                    <label>Lightning Address</label>
                    <input type="text" id="zapTarget" name="zapTarget"/>
                </div>
                <button>Submit!</button>
            </form>
        </div>
    );
}

export default Upload;
