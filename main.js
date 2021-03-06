(function() {

  'use strict';
  
  var vm  = new Vue({
    el: '#app',
    data: {
      newItem: '',
      todos: []
    },
    watch: {
      todos: {
        handler: function() {
          localStorage.setItem('todos' , JSON.stringify(this.todos));
        },
        deep: true
      }
    },
    mounted: function() {
      this.todos = JSON.parse(localStorage.getItem('todos')) || [{
        title: 'apple',
        isDone: false
        }, {
        title: 'banana',
        isDone: false
        }, {
        title: 'blueberry',
        isDone: false
        }, {
        title: 'pineapple',
        isDone: true
        }, {
        title: 'orange',
        isDone: false
        }]
    },

    methods: {
      addItem: function() {
        var item = {
          title: this.newItem,
          isDone: false
        };
        this.todos.push(item);
        this.newItem = '';
      },
      deleteItem: function(index) {
        if (confirm('You sure?')){
          this.todos.splice(index, 1);
        }
      },
      purge: function() {
        if (!confirm('Delete finished?')){
          return;
        }
        this.todos = this.remaining;
      }
    },
    computed: {
      remaining: function() {  
        return this.todos.filter(function(todo) {
          return !todo.isDone; 
        });
      },
      typing: function() {
        return this.remaining.map(function(obj) {
          return obj.title;
        });
      }
    }
  });
  
  let words = [];

  let word;
  let loc;

  let score;
  let miss;
  const timeLimit = 60 * 1000;
  let startTime;
  let isPlaying = false;
  
  
  const target = document.getElementById('target');
  const scoreLabel = document.getElementById('score');
  const  missLabel = document.getElementById('miss');
  const  timerLabel = document.getElementById('timer');
  
  
  function updateTarget() {
    let palceholder = '';
    for (let i = 0; i < loc; i++) {
      palceholder += '_';
    }
    target.textContent = palceholder + word.substring(loc);
  }
  
  function updateTimer() {
    const timeLeft = startTime + timeLimit - Date.now();
    timerLabel.textContent = (timeLeft / 1000).toFixed(2);
    
    const timeoutId = setTimeout(() => {
      updateTimer();
    }, 10);
    
    if (timeLeft < 0) {
      isPlaying = false;
      clearTimeout(timeoutId);
      timerLabel.textContent = '0.00';
      setTimeout(() => {
        showResult();
      }, 100);
      
      target.textContent = ' Double click to replay';
    }
  }
  
  function showResult() {
    const accuracy = score + miss === 0 ? 0 : score / (score + miss) * 100 ; 
    alert(`${score} letters, ${miss} misses, ${accuracy.toFixed(2)}% accuracy!`);
  }
  
  window.addEventListener('dblclick' , () => {
    if (isPlaying === true) {
      return;
    }
    isPlaying = true;
    
    words = vm.typing

    loc = 0;
    score = 0;
    miss = 0; 
    scoreLabel.textContent = score;
    missLabel.textContent = miss;
    word = words[Math.floor(Math.random() * words.length)];
    
    
    target.textContent = word;
    startTime = Date.now();
    updateTimer();
  }); 
  
  window.addEventListener('keydown', e => {
    if (isPlaying !== true) {
      return;
    }
    if (e.key === word[loc]) {
      loc++
      if (loc === word.length) {
        word = words[Math.floor(Math.random() * words.length)];
        loc = 0;
      }
      updateTarget();
      score++
      scoreLabel.textContent = score;
    } else {
      miss++
      missLabel.textContent = miss;
    }
  });

})();