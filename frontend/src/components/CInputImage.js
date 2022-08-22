import React, { useEffect, useState } from 'react'
/*
* onFileChange => return callback with base64 string of image
*/
function CInputImage({ onFileChange = (base64String) => { }, value, isShowUploadButton, resetDefaultState }) {
    const [preview, setPreview] = useState(value)
    const _handleFileChange = (e) => {
        e.preventDefault()
        const objectUrl = URL.createObjectURL(e.target.files?.[0])
        console.log("VALUE,", e.target.files )
        console.log("WDWDWDWD", value)
        const fileType = e.target.files?.[0].type
        const fileSize = e.target.files?.[0].size
        if (fileSize/1000 > 1000) {
            alert("File size is too big")
            e.target.value = ""
        }{
            if (fileType == "image/png" || fileType == "image/jpeg" || fileType == "image/jpg") {
                //convert image to base64 format
                var reader = new FileReader();
                reader.onloadend = function () {
                    console.log('Base64 string', reader.result)
                    const base64String = reader.result
                    onFileChange(base64String)
                    console.log('Base64 string', reader.result)
                }
                reader.readAsDataURL(e.target.files?.[0])

                //setPreview(objectUrl)
            }else{
                alert("File type is not supported")
                e.target.value = ""
            }
        }
       
    }

    useEffect(() => {
        if (resetDefaultState) {
            // console.log("bbwdhbhw", value)
            setPreview(value)
        }

    }, [resetDefaultState])


    const display = isShowUploadButton ? 'inline' : 'none'
    
    return (
        <div>
            <img src={preview} style={{ maxHeight: '300px', objectFit: 'cover' }} />
            <input style={{ display: display }} type="file" onChange={_handleFileChange} />
        </div>
    )
}

export default CInputImage