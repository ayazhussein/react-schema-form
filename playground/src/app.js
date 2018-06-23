/*eslint no-console: off*/
import React, { Component } from 'react';
import { render } from 'react-dom';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';

import { shouldRender } from 'react-jsonschema-form/src/utils';
import BaseForm from 'react-jsonschema-form';
import theme from 'react-jsonschema-form-bootstrap';

import { samples } from './samples';
import CheckMark from './components/icons/Checkmark';
import Cross from './components/icons/Cross';

// Import a few CodeMirror themes; these are used to match alternative
// bootstrap ones.
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/ttcn.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/eclipse.css';

const Form = props => <BaseForm theme={theme} {...props} />;
const log = type => console.log.bind(console, type);
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const liveValidateSchema = { type: 'boolean', title: 'Live validation' };
const cmOptions = {
  theme: 'default',
  height: 'auto',
  viewportMargin: Infinity,
  mode: {
    name: 'javascript',
    json: true,
    statementIndent: 2
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2
};
const themes = {
  default: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
  },
  cerulean: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/cerulean/bootstrap.min.css'
  },
  cosmo: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/cosmo/bootstrap.min.css'
  },
  cyborg: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/cyborg/bootstrap.min.css',
    editor: 'blackboard'
  },
  darkly: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/darkly/bootstrap.min.css',
    editor: 'mbo'
  },
  flatly: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/flatly/bootstrap.min.css',
    editor: 'ttcn'
  },
  journal: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/journal/bootstrap.min.css'
  },
  lumen: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/lumen/bootstrap.min.css'
  },
  litera: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/litera/bootstrap.min.css'
  },
  sandstone: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/sandstone/bootstrap.min.css',
    editor: 'solarized'
  },
  simplex: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/simplex/bootstrap.min.css',
    editor: 'ttcn'
  },
  slate: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/slate/bootstrap.min.css',
    editor: 'monokai'
  },
  spacelab: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/spacelab/bootstrap.min.css'
  },
  superhero: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/superhero/bootstrap.min.css',
    editor: 'dracula'
  },
  united: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/united/bootstrap.min.css'
  },
  yeti: {
    stylesheet:
      '//stackpath.bootstrapcdn.com/bootswatch/4.1.1/yeti/bootstrap.min.css',
    editor: 'eclipse'
  }
};

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <div className="row">
          <div className="col-sm-6">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange('lat')}
            />
          </div>
          <div className="col-sm-6">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange('lon')}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange = (editor, metadata, code) => {
    this.setState({ valid: true, code });
    setImmediate(() => {
      try {
        this.props.onChange(fromJson(this.state.code));
      } catch (err) {
        this.setState({ valid: false, code });
      }
    });
  };

  render() {
    const { title, theme } = this.props;
    return (
      <div className="card mb-4">
        <div className="card-header">
          {this.state.valid ? <CheckMark /> : <Cross />}
          {' ' + title}
        </div>
        <CodeMirror
          value={this.state.code}
          onChange={this.onCodeChange}
          autoCursor={false}
          options={Object.assign({}, cmOptions, { theme })}
        />
      </div>
    );
  }
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: 'Simple' };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <ul className="nav nav-pills">
        {Object.keys(samples).map((label, i) => {
          return (
            <li key={i} role="presentation" className={'nav-item'}>
              <a
                href="#"
                onClick={this.onLabelClick(label)}
                className={`nav-link${
                  this.state.current === label ? ' active' : ''
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

function ThemeSelector({ theme, select }) {
  const themeSchema = {
    type: 'string',
    enum: Object.keys(themes)
  };
  return (
    <Form
      schema={themeSchema}
      formData={theme}
      onChange={({ formData }) => select(formData, themes[formData])}
    >
      <div />
    </Form>
  );
}

class CopyLink extends Component {
  onCopyClick = () => {
    this.input.select();
    document.execCommand('copy');
  };

  render() {
    const { shareURL, onShare } = this.props;
    if (!shareURL) {
      return (
        <button className="btn btn-secondary" type="button" onClick={onShare}>
          Share
        </button>
      );
    }
    return (
      <div className="input-group">
        <input
          type="text"
          ref={input => (this.input = input)}
          className="form-control"
          defaultValue={shareURL}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={this.onCopyClick}
          >
            <i className="glyphicon glyphicon-copy" />
          </button>
        </span>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, validate } = samples.Simple;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      editor: 'default',
      theme: 'default',
      liveValidate: true,
      shareURL: null
    };
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === 'string' && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert('Unable to load form setup data.');
      }
    } else {
      this.load(samples.Simple);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // force resetting form component instance
    this.setState({ form: false }, () =>
      this.setState({
        ...data,
        form: true,
        templates: data.templates
      })
    );
  };

  onSchemaEdited = schema => this.setState({ schema, shareURL: null });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  onThemeSelected = (theme, { stylesheet, editor }) => {
    this.setState({ theme, editor: editor ? editor : 'default' });
    setImmediate(() => {
      // Side effect!
      document.getElementById('theme').setAttribute('href', stylesheet);
    });
  };

  setLiveValidate = ({ formData }) => this.setState({ liveValidate: formData });

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  onShare = () => {
    const { formData, schema, uiSchema } = this.state;
    const {
      location: { origin, pathname }
    } = document;
    try {
      const hash = btoa(JSON.stringify({ formData, schema, uiSchema }));
      this.setState({ shareURL: `${origin}${pathname}#${hash}` });
    } catch (err) {
      this.setState({ shareURL: null });
    }
  };

  render() {
    const {
      schema,
      uiSchema,
      formData,
      liveValidate,
      validate,
      theme,
      editor,
      templates,
      transformErrors
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="pb-2 mt-2 mb-3 border-bottom">
          <h1>react-jsonschema-form</h1>
          <div className="row">
            <div className="col-sm-8">
              <Selector onSelected={this.load} />
            </div>
            <div className="col-sm-2">
              <Form
                idPrefix="live-validate"
                schema={liveValidateSchema}
                formData={liveValidate}
                onChange={this.setLiveValidate}
              >
                <div />
              </Form>
            </div>
            <div className="col-sm-2">
              <ThemeSelector theme={theme} select={this.onThemeSelected} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7">
            <Editor
              title="JSONSchema"
              theme={editor}
              code={toJson(schema)}
              onChange={this.onSchemaEdited}
            />
            <div className="row">
              <div className="col-sm-6">
                <Editor
                  title="UISchema"
                  theme={editor}
                  code={toJson(uiSchema)}
                  onChange={this.onUISchemaEdited}
                />
              </div>
              <div className="col-sm-6">
                <Editor
                  title="formData"
                  theme={editor}
                  code={toJson(formData)}
                  onChange={this.onFormDataEdited}
                />
              </div>
            </div>
          </div>
          <div className="col-md-5 mb-3">
            {this.state.form && (
              <Form
                liveValidate={liveValidate}
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={this.onFormDataChange}
                onSubmit={({ formData }) =>
                  console.log('submitted formData', formData)
                }
                fields={{ geo: GeoPosition }}
                templates={templates}
                validate={validate}
                onBlur={(id, value) =>
                  console.log(`Touched ${id} with value ${value}`)
                }
                onFocus={(id, value) =>
                  console.log(`Focused ${id} with value ${value}`)
                }
                transformErrors={transformErrors}
                onError={log('errors')}
              >
                <div className="row">
                  <div className="col-sm-3">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                  <div className="col-sm-9 text-right">
                    <CopyLink
                      shareURL={this.state.shareURL}
                      onShare={this.onShare}
                    />
                  </div>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
