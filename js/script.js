let tabUsers = null;
let tabStatistic = null;
let buttonSearch = null;
let summaryUsers = null;
let summaryStatistic = null;
let numberFormat = null;
let spinnerLoading = null;

let allUsers = [];

window.addEventListener('load', () => {
  inputName = document.querySelector('#inputName');
  buttonSearch = document.querySelector('#buttonSearch');
  tabUsers = document.querySelector('#tabUsers');
  tabStatistic = document.querySelector('#tabStatistic');
  summaryUsers = document.querySelector('#summaryUsers');
  summaryStatistic = document.querySelector('#summaryStatistic');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchUsers();
  activateInput();
  /*
  setTimeout(() => {
    document.querySelector('#spinnerLoading').classList.add('hide');
    inputName.value = '';
    inputName.focus();
  }, 1000);*/
});

async function fetchUsers() {
  const url =
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

  const resource = await fetch(url);
  const json = await resource.json();

  allUsers = json.results.map((user) => {
    const {
      name: { first, last },
      picture: { large },
      dob: { age },
      gender,
    } = user;

    return {
      name: first + ' ' + last,
      picture: large,
      age,
      gender,
    };
  });
}

function activateInput() {
  function Search() {
    filterUsers(inputName.value);
  }

  function handleTyping(event) {
    let hasText = !!event.target.value && event.target.value.trim() !== '';

    if (hasText) {
      buttonSearch.classList.remove('disabled');
      if (event.key === 'Enter') {
        filterUsers(event.target.value);
      }
      return;
    }
    buttonSearch.classList.add('disabled');
  }

  inputName.addEventListener('keyup', handleTyping);
  buttonSearch.addEventListener('click', Search);
  inputName.focus();
}

function filterUsers(searchName) {
  let usersHTML = '<div>';
  let totalUsers = [];

  function resultStatistic() {
    let statisticHTML = '';

    const totalMale = totalUsers.filter((user) => user.gender === 'male')
      .length;
    const totalFemale = totalUsers.filter((user) => user.gender === 'female')
      .length;
    const totalAges = totalUsers.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);

    statisticHTML += `
    <ul>
      <li>Sexo masculino: ${totalMale}</li>
      <li>Sexo feminino: ${totalFemale}</li>
      <li>Soma das idades: ${totalAges}</li>
      <li>Média das idades: ${(totalAges / (totalMale + totalFemale)).toFixed(
        2
      )}</li>
    </ul> 
    `;
    tabStatistic.innerHTML = statisticHTML;
  }

  totalUsers = allUsers.filter((user) =>
    user.name.toUpperCase().includes(searchName.toUpperCase())
  );

  totalUsers
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((user) => {
      const { name, picture, age } = user;
      const userHMTL = `
  <div class="user">
    <div>
      <img src="${picture}" alt="${name}"/>
    </div>
    <div>
      ${name} , ${age} anos
    </div>
  </div>  
  `;
      usersHTML += userHMTL;
    }, 0);

  usersHTML += '</div>';
  tabUsers.innerHTML = usersHTML;

  resultStatistic();
  updateTitles(totalUsers.length);
}

function updateTitles(title) {
  if (title === 0) {
    tabUsers.innerHTML = '';
    tabStatistic.innerHTML = '';
    summaryUsers.textContent = 'Nenhum usuário filtrado';
    summaryStatistic.textContent = 'Nada a ser exibido';
    return;
  }
  summaryUsers.textContent = `${title} usuário(s) encontrado(s)`;
  summaryStatistic.textContent = 'Estatísticas';
}
