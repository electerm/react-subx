/* eslint-env jest */
import React from 'react'
import TestRenderer from 'react-test-renderer'

describe('shouldComponentUpdate', () => {
  test('Class A', () => {
    class A extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          firstName: 'Tyler'
        }
      }
      render () {
        return <div>
          {this.state.firstName}
          <button onClick={e => this.setState({ firstName: 'Peter' })}>Peter</button>
        </div>
      }
      shouldComponentUpdate (nextProps, nextState) {
        expect(this.props).toBe(nextProps)
        expect(this.state).not.toBe(nextState)
        return true
      }
    }

    const renderer = TestRenderer.create(<A />)
    const button = renderer.root.find(el => el.type === 'button')
    button.props.onClick()
  })

  test('class B & C', () => {
    class C extends React.Component {
      render () {
        return this.props.firstName
      }
      shouldComponentUpdate (nextProps, nextState) {
        expect(this.props).not.toBe(nextProps)
        expect(this.state).toBe(nextState)
        return true
      }
    }

    class B extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          firstName: 'Tyler'
        }
      }
      render () {
        return <div>
          <C firstName={this.state.firstName} />
          <button onClick={e => this.setState({ firstName: 'Peter' })}>Peter</button>
        </div>
      }
    }

    const renderer = TestRenderer.create(<B />)
    const button = renderer.root.find(el => el.type === 'button')
    button.props.onClick()
  })

  test('class D', () => {
    let count = 0
    class D extends React.Component {
      render () {
        return <div>
          {this.props.person.firstName}
          <button onClick={e => { this.props.person.firstName = 'Peter' }}>Peter</button>
        </div>
      }
      shouldComponentUpdate (nextProps, nextState) {
        count += 1
        return true
      }
    }

    const renderer = TestRenderer.create(<D person={{ firstName: 'Tyler' }} />)
    const button = renderer.root.find(el => el.type === 'button')
    button.props.onClick()
    expect(count).toBe(0)
  })

  test('class E & F', () => {
    class E extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          todos: [
            {
              title: '111'
            },
            {
              title: '222'
            }
          ]
        }
      }
      render () {
        return <div>
          {this.state.todos.map(todo => <F key={todo.title} todo={todo} />)}
          <button onClick={e => { this.setState({ todos: [...this.state.todos, { title: '333' }] }) }}>Add</button>
        </div>
      }
    }

    class F extends React.Component {
      render () {
        return this.props.todo.title
      }
      shouldComponentUpdate (nextProps, nextState) {
        expect(this.state).toBe(nextState)
        expect(nextState).toBeNull()
        expect(this.props).not.toBe(nextProps) // weird
        expect(this.props.todo).toBe(nextProps.todo)
        expect(Object.keys(nextProps)).toEqual(['todo'])
        return true
      }
    }

    const renderer = TestRenderer.create(<E />)
    const button = renderer.root.find(el => el.type === 'button')
    button.props.onClick()
  })
})
