import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@mui/material';

const SignaturePad = ({ formik, name, label }) => {
  const sigCanvas = useRef({});

  const clear = () => {
    sigCanvas.current.clear();
    formik.setFieldValue(name, '');
  };

  const saveAndUpload = () => {
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    formik.setFieldValue(name, dataUrl);
  };

  return (
    <div className='sigCanvasContainer'>
        <label htmlFor="" className="label-text">{label}</label>
        <div className="sign-contain">
        <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 300, height: 100, className: 'sigCanvas' }}
            onEnd={saveAndUpload}
        />
        </div>
      <div style={{ marginTop: '10px' }}>
        <Button variant="contained" color="primary" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
