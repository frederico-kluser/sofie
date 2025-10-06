import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [isValidKey, setIsValidKey] = useState(false);
  const [keyValidationStatus, setKeyValidationStatus] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Função para validar API Key
  const validateApiKey = async (key) => {
    if (!key || key.length < 10) {
      setIsValidKey(false);
      setKeyValidationStatus('');
      return;
    }

    setKeyValidationStatus('Validando API Key...');

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsValidKey(true);
        setKeyValidationStatus('✅ API Key válida');
        setTimeout(() => setKeyValidationStatus(''), 3000);
      } else {
        setIsValidKey(false);
        const error = await response.json();
        setKeyValidationStatus('❌ API Key inválida');
        console.error('API Key inválida:', error);
      }
    } catch (error) {
      setIsValidKey(false);
      setKeyValidationStatus('❌ Erro ao validar API Key');
      console.error('Erro ao validar API Key:', error);
    }
  };

  // Validar API Key quando ela mudar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (apiKey) {
        validateApiKey(apiKey);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [apiKey]);

  // Função para enviar prompt para ChatGPT
  const sendToGPT = async () => {
    if (!apiKey) {
      setResponse('Por favor, insira a API Key do OpenAI.');
      return;
    }

    if (!inputText.trim()) {
      setResponse('Por favor, insira um texto para enviar.');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: inputText
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao chamar API');
      }

      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      setResponse(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para iniciar gravação
  const startRecording = async () => {
    try {
      setRecordingError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);

        // Limpar stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setRecordingError(`Erro ao acessar microfone: ${error.message}`);
      console.error('Erro ao iniciar gravação:', error);
    }
  };

  // Função para parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Função para transcrever áudio
  const transcribeAudio = async (audioBlob) => {
    if (!apiKey) {
      setRecordingError('Por favor, insira a API Key do OpenAI para transcrever.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'pt');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao transcrever áudio');
      }

      const data = await response.json();
      setInputText(data.text);
    } catch (error) {
      setRecordingError(`Erro na transcrição: ${error.message}`);
      console.error('Erro ao transcrever:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atalho de teclado para enviar (Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendToGPT();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sofie - ChatGPT Interface</h1>

        {/* Input para API Key */}
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
          <input
            type="password"
            placeholder="Insira sua API Key do OpenAI"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: isValidKey ? '2px solid #4CAF50' : '1px solid #ccc'
            }}
          />
          {keyValidationStatus && (
            <div style={{
              marginTop: '5px',
              fontSize: '14px',
              color: keyValidationStatus.includes('✅') ? '#4CAF50' : keyValidationStatus.includes('❌') ? '#f44336' : '#666'
            }}>
              {keyValidationStatus}
            </div>
          )}
        </div>

        {/* Input de texto principal */}
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
          <textarea
            placeholder="Digite sua mensagem aqui..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={sendToGPT}
            disabled={isLoading || !isValidKey || !inputText}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: isLoading || !isValidKey ? '#ccc' : '#4CAF50',
              color: 'white',
              cursor: isLoading || !isValidKey || !inputText ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading || !isValidKey}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: !isValidKey ? '#ccc' : isRecording ? '#f44336' : '#2196F3',
              color: 'white',
              cursor: isLoading || !isValidKey ? 'not-allowed' : 'pointer'
            }}
            title={!isValidKey ? 'Insira uma API Key válida para gravar' : ''}
          >
            {isRecording ? '⏹️ Parar Gravação' : '🎤 Gravar Voz'}
          </button>
        </div>

        {/* Mensagem de erro de gravação */}
        {recordingError && (
          <div style={{ color: '#f44336', marginBottom: '10px' }}>
            {recordingError}
          </div>
        )}

        {/* Resposta */}
        {response && (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <h3>Resposta:</h3>
            <p style={{
              padding: '15px',
              backgroundColor: '#f0f0f0',
              borderRadius: '5px',
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              color: '#333'
            }}>
              {response}
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
