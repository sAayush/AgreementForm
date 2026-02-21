"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import SignaturePad from "signature_pad"

interface Props {
  studentName: string
  onBack: () => void
  onSubmit: (signatureDataUrl: string) => void
  error: string
}

type SignatureMode = "draw" | "type"

export default function SignatureStep({ studentName, onBack, onSubmit, error }: Props) {
  const [mode, setMode] = useState<SignatureMode>("draw")
  const [typedSignature, setTypedSignature] = useState("")
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)

  // Initialize signature pad
  useEffect(() => {
    if (mode !== "draw" || !canvasRef.current) return

    const canvas = canvasRef.current
    const parent = canvas.parentElement
    if (!parent) return

    // Set canvas size
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = parent.offsetWidth * ratio
    canvas.height = 200 * ratio
    canvas.style.width = `${parent.offsetWidth}px`
    canvas.style.height = "200px"

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(ratio, ratio)
    }

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgba(0, 0, 0, 0)",
      penColor: "#4f46e5",
      minWidth: 1.5,
      maxWidth: 3,
    })

    pad.addEventListener("endStroke", () => {
      setHasDrawnSignature(!pad.isEmpty())
    })

    signaturePadRef.current = pad

    return () => {
      pad.off()
    }
  }, [mode])

  // Handle window resize for canvas
  useEffect(() => {
    const handleResize = () => {
      if (mode !== "draw" || !canvasRef.current || !signaturePadRef.current) return
      const canvas = canvasRef.current
      const parent = canvas.parentElement
      if (!parent) return

      const data = signaturePadRef.current.toData()
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = parent.offsetWidth * ratio
      canvas.height = 200 * ratio
      canvas.style.width = `${parent.offsetWidth}px`
      canvas.style.height = "200px"

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(ratio, ratio)
      }

      signaturePadRef.current.fromData(data)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mode])

  const clearSignature = useCallback(() => {
    if (mode === "draw" && signaturePadRef.current) {
      signaturePadRef.current.clear()
      setHasDrawnSignature(false)
    } else {
      setTypedSignature("")
    }
  }, [mode])

  const getSignatureDataUrl = (): string | null => {
    if (mode === "draw") {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        return null
      }
      return signaturePadRef.current.toDataURL("image/png")
    } else {
      if (!typedSignature.trim()) return null
      // Generate a data URL from typed text using canvas
      const canvas = document.createElement("canvas")
      canvas.width = 600
      canvas.height = 150
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      ctx.fillStyle = "transparent"
      ctx.fillRect(0, 0, 600, 150)
      ctx.font = "48px Caveat, cursive"
      ctx.fillStyle = "#4f46e5"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(typedSignature, 300, 75)

      return canvas.toDataURL("image/png")
    }
  }

  const handleSubmit = () => {
    const dataUrl = getSignatureDataUrl()
    if (!dataUrl) return
    onSubmit(dataUrl)
  }

  const isValid = mode === "draw" ? hasDrawnSignature : typedSignature.trim().length > 0

  return (
    <div>
      <h2 className="form-card-title">Sign the Agreement</h2>
      <p className="form-card-subtitle">
        Provide your digital signature by drawing or typing your name below.
      </p>

      {/* Mode Toggle */}
      <div className="signature-mode-toggle">
        <button
          type="button"
          className={`signature-mode-btn ${mode === "draw" ? "active" : ""}`}
          onClick={() => setMode("draw")}>
          Draw Signature
        </button>
        <button
          type="button"
          className={`signature-mode-btn ${mode === "type" ? "active" : ""}`}
          onClick={() => setMode("type")}>
          Type Signature
        </button>
      </div>

      {/* Draw Mode */}
      {mode === "draw" && (
        <>
          <div className="signature-canvas-wrapper">
            <canvas ref={canvasRef} />
            <div className={`signature-canvas-placeholder ${hasDrawnSignature ? "hidden" : ""}`}>
              <span>Draw your signature here</span>
            </div>
          </div>
          <div className="signature-actions">
            <button type="button" className="btn btn-ghost" onClick={clearSignature}>
              Clear
            </button>
          </div>
        </>
      )}

      {/* Type Mode */}
      {mode === "type" && (
        <>
          <input
            type="text"
            className="signature-typed-input"
            placeholder="Type your full name..."
            value={typedSignature}
            onChange={e => setTypedSignature(e.target.value)}
            autoFocus
          />
          {typedSignature && (
            <div className="signature-preview">
              <p>Signature Preview</p>
              <div className="preview-name">{typedSignature}</div>
            </div>
          )}
          <div className="signature-actions">
            <button type="button" className="btn btn-ghost" onClick={clearSignature}>
              Clear
            </button>
          </div>
        </>
      )}

      {/* Signer info */}
      <div className="signature-preview" style={{ marginBottom: "0" }}>
        <p>Signing as</p>
        <div className="detail-value">{studentName}</div>
        <p style={{ marginTop: "4px" }}>
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="error-message"
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "var(--error-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}>
          ⚠ {error}
        </div>
      )}

      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!isValid}
          onClick={handleSubmit}>
          Submit & Sign
        </button>
      </div>
    </div>
  )
}
