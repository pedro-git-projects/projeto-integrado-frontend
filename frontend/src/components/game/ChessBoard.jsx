import { useState, useEffect } from "react"
import { useWebSocket } from "../../contexts/WebSocketContext"
import whitePawn from "../../assets/white_pawn.svg"
import blackPawn from "../../assets/black_pawn.svg"
import whiteKnight from "../../assets/white_horse.svg"
import blackKnight from "../../assets/black_horse.svg"
import whiteBishop from "../../assets/white_bishop.svg"
import blackBishop from "../../assets/black_bishop.svg"
import whiteRook from "../../assets/white_rook.svg"
import blackRook from "../../assets/black_rook.svg"
import whiteQueen from "../../assets/white_queen.svg"
import blackQueen from "../../assets/black_queen.svg"
import whiteKing from "../../assets/white_king.svg"
import blackKing from "../../assets/black_king.svg"
import sendMessage from "../../hooks/sendMessage"

const getPieceSymbol = (piece) => {
  const [color, type] = piece.split(" ")
  const svg = {
    "white-pawn": whitePawn,
    "black-pawn": blackPawn,
    "white-rook": whiteRook,
    "black-rook": blackRook,
    "white-knight": whiteKnight,
    "black-knight": blackKnight,
    "white-bishop": whiteBishop,
    "black-bishop": blackBishop,
    "white-queen": whiteQueen,
    "black-queen": blackQueen,
    "white-king": whiteKing,
    "black-king": blackKing,
  }[`${color}-${type}`]
  return <img src={svg} alt={type} />
}

const renderSquare = (
  { roomID, clientID, clientColor },
  colIndex,
  rowIndex,
  boardState,
  setBoardState,
) => {
  const coordinate = `${String.fromCharCode(104 - colIndex)}${rowIndex + 1}`
  const square = boardState.find((square) => square.coordinate === coordinate)
  const isEvenSquare = (colIndex + rowIndex) % 2 === 0
  const backgroundColor = isEvenSquare ? "bg-[#93AFC0]" : "bg-[#DDE6EB]"
  const ws = useWebSocket()
  const handleClick = async () => {
    console.log(coordinate)
    const msg = JSON.stringify({
      message: "calc",
      coordinate: coordinate,
      room_id: roomID,
      client_id: clientID,
    })
    const resp = await sendMessage(ws, msg)
    console.log("response received:", resp)
    setBoardState(
      boardState.map((square) => {
        if (
          JSON.parse(resp.legal_movements).some(
            (d) => d.coordinate === square.coordinate,
          )
        ) {
          return { ...square, highlighted: true }
        }
        return { ...square, highlighted: false }
      }),
    )
  }
  return (
    <div
      key={`${colIndex}${rowIndex}`}
      className={`w-16 h-16 flex items-center justify-center ${backgroundColor} ${
        square?.highlighted ? "relative" : ""
      }`}
      onClick={handleClick}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", coordinate)
      }}
      onDragOver={(e) => {
        e.preventDefault()
      }}
      onDrop={(e) => {
        const from = e.dataTransfer.getData("text/plain")
        const to = coordinate
        const msg = JSON.stringify({
          message: "move",
          room_id: roomID,
          from: from,
          to: to,
          client_id: clientID,
        })
        sendMessage(ws, msg)
      }}
    >
      {square && square.piece !== "empty" && getPieceSymbol(square.piece)}
      {square?.highlighted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-full h-full bg-yellow-300 opacity-50`}></div>
        </div>
      )}
    </div>
  )
}

const renderRow = (
  { roomID, clientID, clientColor },
  rowIndex,
  boardState,
  setBoardState,
) => (
  <div key={`row${rowIndex}`} className="flex flex-row">
    {Array.from(Array(8).keys())
      .reverse()
      .map((colIndex) =>
        renderSquare(
          { roomID, clientID, clientColor },
          colIndex,
          rowIndex,
          boardState,
          setBoardState,
        ),
      )}
  </div>
)

const renderBoard = ({ roomID, clientID, clientColor }, boardState, setBoardState) => (
  <div>
    {Array.from(Array(8).keys())
      .reverse()
      .map((rowIndex) =>
        renderRow({ roomID, clientID, clientColor }, rowIndex, boardState, setBoardState),
      )}
  </div>
)

const ChessBoard = ({ roomID, clientID, clientColor, turn, onTurnUpdate }) => {
  const [boardState, setBoardState] = useState([])
  const [latestMove, setLatestMove] = useState(null)
  const ws = useWebSocket()

  useEffect(() => {
    const fetchBoardState = async () => {
      const msg = JSON.stringify({
        message: "render",
        room_id: roomID,
        client_id: clientID,
      })
      const resp = await sendMessage(ws, msg)
      console.log("response received:", resp)
      setBoardState(JSON.parse(resp.state))
    }
    fetchBoardState()
  }, [])

  useEffect(() => {
    const handleMessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.legal_movements) {
        const legalMovements = JSON.parse(data.legal_movements)
        const newBoardState = boardState.map((square) => {
          if (legalMovements.some((d) => d.coordinate === square.coordinate)) {
            return { ...square, highlighted: true }
          } else {
            return { ...square, highlighted: false }
          }
        })
        setBoardState(newBoardState)
      } else if (
        data.state &&
        data.from === latestMove?.from &&
        data.to === latestMove?.to
      ) {
        setBoardState(JSON.parse(data.state))
        onTurnUpdate(data.turn || JSON.parse(data.turn))
        setLatestMove(null)
      }
    }
    ws.addEventListener("message", handleMessage)
    return () => {
      ws.removeEventListener("message", handleMessage)
    }
  }, [boardState, latestMove, ws])
  return renderBoard({ roomID, clientID, clientColor }, boardState, setBoardState)
}

export default ChessBoard
