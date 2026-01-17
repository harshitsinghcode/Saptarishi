import streamlit as st
from langchain_core.messages import HumanMessage
from backend import chatbot 

st.title("🤖 Saptarishi v.02")

CONFIG = {'configurable': {'thread_id': 'thread-1'}}

if 'message_history' not in st.session_state:
    st.session_state['message_history'] = []

for message in st.session_state['message_history']:
    with st.chat_message(message['role']):
        st.markdown(message['content'])  

user_input = st.chat_input('Type your message here...')

if user_input:
    st.session_state['message_history'].append({'role': 'user', 'content': user_input})
    with st.chat_message('user'):
        st.markdown(user_input)

   
    response = chatbot.invoke(
        {'messages': [HumanMessage(content=user_input)]}, 
        config=CONFIG
    )
    
    ai_message_content = response['messages'][-1].content
    
    st.session_state['message_history'].append({'role': 'assistant', 'content': ai_message_content})
    with st.chat_message('assistant'):
        st.markdown(ai_message_content) 