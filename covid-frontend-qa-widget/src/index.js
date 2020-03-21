import React, { useState, useEffect } from 'react'
import { FaBullhorn } from 'react-icons/fa';

import styles from './styles.css'

const CoViDQAWidget = () => {

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState({ question: '', answer: '' });

  // no async, because then we need polyfills
  const fetchData = (question) => {
    fetch('https://covid-middleware-staging.deepset.ai/api/bert/question',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ question })
      })
      .then(data => data.json())
      .catch(error => ({ question: '', answer: '' }))
      .then(response => response.answers.sort((a, b) => b.score - a.score)[0] || '')
      .then(answer => setAnswer(answer));
  };

  useEffect(() => {

    if (!question || question.length < 5) {
      return;
    }

    fetchData(question);
  }, [question]);


  const onKeyDown = ({ keyCode, target }) => {
    if (keyCode === 13) {
      setQuestion(target.value);
      target.value = '';
    }
  }

  const onOpenClose = () => {
    setOpen(!open);
    setAnswer({ question: '', answer: '' })
  }

  const classNames = (...classes) => classes
    .map(e => {
      return typeof e === 'object'
      ? Object.keys(e).map(k => e[k] ? k : '').join(' ')
      : e})
    .join(' ')

  const renderChat = () => (
    <div className={styles.wrapper}>
      <div className={styles.answered}>{answer && answer.question}</div>
      <div className={styles.answer}>{answer && answer.answer}</div>
      <div></div>
      <div className={styles.question}><input autoFocus type="text" placeholder="Your Question" onKeyDown={onKeyDown}></input></div>
    </div>
  );

  let answerGiven = answer && answer.answer.length > 0;
  let wrapperClasses = classNames(styles.btn, { [styles.med]: open && !answerGiven, [styles.max]: answerGiven });

  return (
    <div className={styles.floating}>
      <div className={wrapperClasses} onClick={onOpenClose}>
        {open && renderChat()}
        <FaBullhorn className={classNames({ [styles.hidden]: open })} />
      </div>
    </div>
  )
}

export default CoViDQAWidget;
