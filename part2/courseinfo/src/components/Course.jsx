const Header = props => <h1>{props.course}</h1>

const Part = props => <p>{props.name} {props.exercises}</p>

const Content = props => (
  <div>
    {props.parts.map(data =>
      <Part name={data.name} exercises={data.exercises} key={data.id} />
    )}
  </div>
)

const Total = props => {
  const total = props.parts.reduce((res, part) => res + part.exercises, 0)
  return (
    <p>
      <b>total of {total} exercises</b>
    </p>
  )
}

const Course = ({course}) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course