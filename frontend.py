import streamlit as st
from langchain_core.messages import HumanMessage, AIMessageChunk
from backend import chatbot 

st.title("🤖 Saptarishi")

CONFIG = {'configurable': {'thread_id': 'thread-1'}}

if 'message_history' not in st.session_state:
    st.session_state['message_history'] = []

for message in st.session_state['message_history']:
    with st.chat_message(message['role']):
        st.markdown(message['content'])

user_input = st.chat_input('Type here...')

if user_input:
    st.session_state['message_history'].append({'role': 'user', 'content': user_input})
    with st.chat_message('user'):
        st.markdown(user_input)

    with st.chat_message('assistant'):
        
        def stream_generator():
            full_response = ""
            for msg, metadata in chatbot.stream(
                {'messages': [HumanMessage(content=user_input)]}, 
                config=CONFIG, 
                stream_mode="messages" # <--- THIS IS THE KEY CHANGE
            ):
                if isinstance(msg, AIMessageChunk) and msg.content:
                    full_response += msg.content
                    yield msg.content
            
            st.session_state['message_history'].append({'role': 'assistant', 'content': full_response})

        st.write_stream(stream_generator)
