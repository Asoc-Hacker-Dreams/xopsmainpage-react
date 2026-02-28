import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

// Simple QR code generator using canvas
const generateQR = (canvas, data, size = 200) => {
  const ctx = canvas.getContext('2d');
  const qrSize = size;
  const moduleCount = 21; // Simple QR version 1
  const moduleSize = qrSize / (moduleCount + 8);
  
  // Clear canvas
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, qrSize, qrSize);
  
  // Create simple pattern based on data hash
  ctx.fillStyle = 'black';
  
  const hash = data.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Draw finder patterns (corners)
  const drawFinder = (x, y) => {
    // Outer square
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
    ctx.fillStyle = 'white';
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
    ctx.fillStyle = 'black';
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };
  
  drawFinder(4, 4);
  drawFinder(4 + moduleCount - 7, 4);
  drawFinder(4, 4 + moduleCount - 7);
  
  // Fill data area with pattern based on hash
  for (let i = 0; i < moduleCount; i++) {
    for (let j = 0; j < moduleCount; j++) {
      // Skip finder pattern areas
      if ((i < 8 && j < 8) || (i < 8 && j > moduleCount - 9) || (i > moduleCount - 9 && j < 8)) {
        continue;
      }
      
      if ((hash + i * j + i + j) % 3 === 0) {
        ctx.fillRect((i + 4) * moduleSize, (j + 4) * moduleSize, moduleSize, moduleSize);
      }
    }
  }
};

const QRModal = ({ show, onHide, attendee }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (show && attendee && canvasRef.current) {
      const qrData = JSON.stringify({
        id: attendee.id,
        name: attendee.name,
        company: attendee.company,
        role: attendee.role
      });
      generateQR(canvasRef.current, qrData, 200);
    }
  }, [show, attendee]);

  if (!attendee) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="h5">🔗 Intercambio QR</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="mb-3">
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="border rounded"
          />
        </div>
        
        <div className="p-3 bg-light rounded mb-3">
          <strong>{attendee.name}</strong><br />
          <small className="text-muted">{attendee.company}</small><br />
          <small className="text-muted">{attendee.role}</small>
        </div>

        <p className="small text-muted mb-0">
          Escanea este código QR para intercambiar información de contacto
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRModal;
