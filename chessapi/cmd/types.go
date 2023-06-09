package main

type clientInfo struct {
	roomID, clientID, clientColor string
}

type CreateRoomRequest struct {
	Message string `json:"message"`
}

type CreateRoomResponse struct {
	RoomID      string `json:"room_id"`
	ClientID    string `json:"client_id"`
	ClientColor string `json:"client_color"`
	Turn        string `json:"turn"`
}

type RoomUpdateResponse struct {
	Type                  string `json:"type"`
	NumberOfClientsInRoom int    `json:"number_of_clients_in_room"`
}

type JoinRoomRequest struct {
	Message string `json:"message"`
	RoomID  string `json:"room_id"`
}

type JoinRoomResponse struct {
	RoomID                string `json:"room_id"`
	ClientID              string `json:"client_id"`
	Turn                  string `json:"turn"`
	ClientColor           string `json:"client_color"`
	NumberOfClientsInRoom int    `json:"number_of_clients_in_room"`
	Error                 string `json:"error"`
}

type RenderBoardRequest struct {
	Message string `json:"message"`
	RoomID  string `json:"room_id"`
}

type RenderBoardResponse struct {
	GameState string `json:"state"`
	Error     string `json:"error"`
	Turn      string `json:"turn"`
}

type CalculateRequest struct {
	Message    string `json:"message"`
	Coodrinate string `json:"coordinate"`
	RoomID     string `json:"room_id"`
}

type CalculateResponse struct {
	LegalMovements string `json:"legal_movements"`
	Error          string `json:"error"`
}

// Coodrinate is a pointer to string so it can be
// optional, being ommited when empty instead of receiving
// the zero value of the string type, namely ""
type BoardRequest struct {
	Message    string  `json:"message"`
	RoomID     string  `json:"room_id"`
	ClientID   string  `json:"client_id"`
	Coordinate *string `json:"coordinate,omitempty"`
	From       *string `json:"from,omitempty"`
	To         *string `json:"to,omitempty"`
}
