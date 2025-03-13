'use client'

import { useState, useEffect, useRef } from 'react'

interface ChatMessage {
    text: string;
    isSent: boolean;
    from: string;
    to?: string;
}

export default function ChatPage() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [recipientId, setRecipientId] = useState('')
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (socketRef.current) return // ✅ 중복 연결 방지

        const connectWebSocket = async () => {
            await fetch('/api/socket/io') // WebSocket 서버 초기화
            const ws = new WebSocket('ws://localhost:3001')

            ws.onopen = () => console.log('✅ WebSocket connected')

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log(data,"data")
                if (data.type === 'id') {
                    setUserId(data.id)
                } else if (data.type === 'private' || data.type === 'broadcast') {
                    
                    setMessages((prevMessages) => [...prevMessages, { 
                        text: data.message, 
                        isSent: false, 
                        from: data.from 
                    }])
                }
            }

            ws.onerror = (error) => console.error('❌ WebSocket error:', error)
            ws.onclose = () => console.log('❌ WebSocket disconnected')

            socketRef.current = ws
        }

        connectWebSocket()

        return () => {
            socketRef.current?.close()
            socketRef.current = null
        }
    }, [])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        // if (!message || !socketRef.current || !userId) return
        
        const messageData = recipientId 
            ? { type: 'private', from: userId, to: recipientId, message }
            : { type: 'broadcast', from: userId, message }

        socketRef.current.send(JSON.stringify(messageData))
        setMessages((prevMessages) => [...prevMessages, { 
            text: message, 
            isSent: true, 
            from: userId,
            to: recipientId || 'all'
        }])
        setMessage('')
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Chat App</h1>
                {userId && (
                    <div className="bg-blue-600 px-3 py-1 rounded">
                        Your ID: <span className="font-bold">{userId}</span>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`mb-2 p-2 rounded-lg ${
                        msg.isSent ? 'bg-blue-500 text-white self-end' : 'bg-white text-gray-800 self-start'
                        }`}
                    >
                        <div className="font-bold">{msg.isSent ? 'You' : msg.from}</div>
                        <div>{msg.text}</div>
                        {msg.to && <div className="text-xs">{msg.isSent ? `To: ${msg.to}` : ''}</div>}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 bg-white border-t">
                <div className="flex mb-2">
                    <input
                        type="text"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        className="flex-1 border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Recipient ID (leave empty for broadcast)"
                    />
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}
