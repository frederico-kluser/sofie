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
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioBlobRef = useRef(null);

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

      // Verificar se o navegador suporta gravação
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta gravação de áudio');
      }

      // Solicitar permissão para usar o microfone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Detectar o melhor formato de áudio suportado
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      }

      console.log('Usando formato de áudio:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Chunk de áudio recebido:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('Gravação parada, total de chunks:', audioChunksRef.current.length);

        if (audioChunksRef.current.length === 0) {
          setRecordingError('Nenhum áudio foi gravado');
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('Blob de áudio criado:', audioBlob.size, 'bytes');

        // Salvar blob para uso posterior
        audioBlobRef.current = audioBlob;

        // Criar URL para preview do áudio
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(audioUrl);

        // Transcrever o áudio
        await transcribeAudio(audioBlob);

        // Limpar stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('Erro no MediaRecorder:', event);
        setRecordingError(`Erro durante a gravação: ${event.error?.message || 'Erro desconhecido'}`);
        setIsRecording(false);
      };

      // Iniciar gravação com intervalo de tempo para capturar chunks
      mediaRecorder.start(1000); // Capturar dados a cada 1 segundo
      setIsRecording(true);
      console.log('Gravação iniciada');
    } catch (error) {
      setRecordingError(`Erro ao acessar microfone: ${error.message}`);
      console.error('Erro ao iniciar gravação:', error);

      // Mensagem mais específica para erro de permissão
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setRecordingError('Permissão para usar o microfone foi negada. Por favor, permita o acesso ao microfone nas configurações do navegador.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setRecordingError('Nenhum microfone foi encontrado. Por favor, conecte um microfone ao seu dispositivo.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setRecordingError('O microfone está sendo usado por outro aplicativo. Por favor, feche outros aplicativos que possam estar usando o microfone.');
      }
    }
  };

  // Função para parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        console.log('Parando gravação...');
      } catch (error) {
        console.error('Erro ao parar gravação:', error);
        setRecordingError('Erro ao parar gravação');
      }
      setIsRecording(false);
    }
  };

  // Função para transcrever áudio
  const transcribeAudio = async (audioBlob) => {
    if (!apiKey) {
      setRecordingError('Por favor, insira a API Key do OpenAI para transcrever.');
      return;
    }

    if (audioBlob.size === 0) {
      setRecordingError('O arquivo de áudio está vazio');
      return;
    }

    setIsLoading(true);
    setRecordingError('');

    try {
      // Determinar a extensão correta baseada no tipo MIME
      let fileExtension = 'webm';
      const mimeType = audioBlob.type;
      if (mimeType.includes('ogg')) {
        fileExtension = 'ogg';
      } else if (mimeType.includes('mp4')) {
        fileExtension = 'mp4';
      } else if (mimeType.includes('wav')) {
        fileExtension = 'wav';
      }

      console.log('Enviando áudio para transcrição:', {
        size: audioBlob.size,
        type: audioBlob.type,
        extension: fileExtension
      });

      const formData = new FormData();
      formData.append('file', audioBlob, `recording.${fileExtension}`);
      formData.append('model', 'whisper-1');
      formData.append('language', 'pt');
      formData.append('response_format', 'json');

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
      console.log('Transcrição recebida:', data.text);

      if (data.text && data.text.trim()) {
        setInputText(prevText => prevText ? `${prevText} ${data.text}` : data.text);
      } else {
        setRecordingError('Nenhum texto foi reconhecido no áudio');
      }
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
              cursor: isLoading || !isValidKey ? 'not-allowed' : 'pointer',
              animation: isRecording ? 'pulse 1.5s infinite' : 'none'
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

        {/* Preview do áudio gravado */}
        {audioPreviewUrl && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '600px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>🎵 Áudio Gravado:</h3>
            <audio
              controls
              src={audioPreviewUrl}
              style={{
                width: '100%',
                marginBottom: '10px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setAudioPreviewUrl('');
                  setInputText('');
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                🗑️ Descartar
              </button>
              <button
                onClick={() => {
                  if (audioBlobRef.current) {
                    transcribeAudio(audioBlobRef.current);
                  }
                }}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: isLoading ? '#ccc' : '#4CAF50',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                🔄 Transcrever Novamente
              </button>
            </div>
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
