import React, { PureComponent } from 'react';

import { createFormComponent } from './test_utils';

describe('ArrayFieldTemplate', () => {
  const formData = ['one', 'two', 'three'];

  describe('Custom ArrayFieldTemplate of string array', () => {
    function ArrayFieldTemplate(props) {
      return (
        <div className={props.uiSchema.classNames}>
          {props.canAdd && <button className="custom-array-add" />}
          {props.items.map(element => {
            return (
              <div className="custom-array-item" key={element.index}>
                {element.hasMoveUp && (
                  <button className="custom-array-item-move-up" />
                )}
                {element.hasMoveDown && (
                  <button className="custom-array-item-move-down" />
                )}

                {element.children}
              </div>
            );
          })}
        </div>
      );
    }

    describe('Stateful ArrayFieldTemplate', () => {
      class ArrayFieldTemplate extends PureComponent {
        render() {
          return <div>{this.props.items.map(item => item.element)}</div>;
        }
      }

      it('should render a stateful custom component', () => {
        const { node } = createFormComponent({
          schema: { type: 'array', items: { type: 'string' } },
          formData,
          templates: { ArrayFieldTemplate }
        });

        expect(node.querySelectorAll('.field-array div')).toHaveLength(3);
      });
    });

    describe('not fixed items', () => {
      const schema = {
        type: 'array',
        title: 'my list',
        description: 'my description',
        items: { type: 'string' }
      };

      const uiSchema = {
        classNames: 'custom-array'
      };

      let node;

      beforeEach(() => {
        node = createFormComponent({
          templates: { ArrayFieldTemplate },
          formData,
          schema,
          uiSchema
        }).node;
      });

      it('should render one root element for the array', () => {
        expect(node.querySelectorAll('.custom-array')).toHaveLength(1);
      });

      it('should render one add button', () => {
        expect(node.querySelectorAll('.custom-array-add')).toHaveLength(1);
      });

      it('should render one child for each array item', () => {
        expect(node.querySelectorAll('.custom-array-item')).toHaveLength(
          formData.length
        );
      });

      it('should render text input for each array item', () => {
        expect(
          node.querySelectorAll('.custom-array-item .field input[type=text]')
        ).toHaveLength(formData.length);
      });

      it('should render move up button for all but one array items', () => {
        expect(
          node.querySelectorAll('.custom-array-item-move-up')
        ).toHaveLength(formData.length - 1);
      });

      it('should render move down button for all but one array items', () => {
        expect(
          node.querySelectorAll('.custom-array-item-move-down')
        ).toHaveLength(formData.length - 1);
      });
    });

    describe('fixed items', () => {
      const schema = {
        type: 'array',
        title: 'my list',
        description: 'my description',
        items: [{ type: 'string' }, { type: 'string' }, { type: 'string' }]
      };

      const uiSchema = {
        classNames: 'custom-array'
      };

      let node;

      beforeEach(() => {
        node = createFormComponent({
          templates: { ArrayFieldTemplate },
          formData,
          schema,
          uiSchema
        }).node;
      });

      it('should render one root element for the array', () => {
        expect(node.querySelectorAll('.custom-array')).toHaveLength(1);
      });

      it('should not render an add button', () => {
        expect(node.querySelectorAll('.custom-array-add')).toHaveLength(0);
      });

      it('should render one child for each array item', () => {
        expect(node.querySelectorAll('.custom-array-item')).toHaveLength(
          formData.length
        );
      });

      it('should render text input for each array item', () => {
        expect(
          node.querySelectorAll('.custom-array-item .field input[type=text]')
        ).toHaveLength(formData.length);
      });

      it('should not render any move up buttons', () => {
        expect(
          node.querySelectorAll('.custom-array-item-move-up')
        ).toHaveLength(0);
      });

      it('should not render any move down buttons', () => {
        expect(
          node.querySelectorAll('.custom-array-item-move-down')
        ).toHaveLength(0);
      });
    });
  });
});
