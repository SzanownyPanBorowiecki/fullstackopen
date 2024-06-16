const Header = props => <h1>{props.course}</h1>

const Part = props => <p>{props.name} {props.exercises}</p>

const Content = props => (
  <div>
    {props.parts.map(
      data => 
        <Part name={data.name} exercises={data.exercises} />
    )}
  </div>
)

const Total = props => (
  <p>Number of exercises {props.parts.reduce((res, part) => res + part.exercises, 0)}</p>
)

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
