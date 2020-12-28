export interface Card {
  _id: string
  name: string
  imageUrl: string
  count: {
    total: number
  }
}

export interface CardGetResponse {
  data: Card[]
}

export interface CardUpdateRequest {
  name: string
  imageUrl: string
}
