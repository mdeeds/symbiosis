export class Project {
  static emptyProject(tagName: string) {
    const project = new Project();
    project.tagName = tagName;
    project.tabContent = [""];
    return project;
  }

  static storageKey(tagName: string) {
    return `symbiosis/project/${tagName}`;
  }

  static newProject() {
    let i = 1;
    while (true) {
      const tagName = `Untitled ${i}`;
      const key = Project.storageKey(tagName);
      if (!localStorage.getItem(key)) {
        const project = this.emptyProject(tagName);
        localStorage.setItem(key, JSON.stringify(project));
        return project;
      }
      ++i;
    }
  }

  static loadProject(tagName: string) {
    const serializedData = localStorage.getItem(Project.storageKey(tagName));
    if (!serializedData) {
      const newProject = Project.newProject();
      newProject.save();
      return newProject;
    } else {
      const dict = JSON.parse(serializedData);
      const project = new Project();
      Object.assign(project, dict);
      return project;
    }
  }

  private tagName: string;
  tabContent: string[];
  private constructor() { }

  save() {
    const storageKey = Project.storageKey(this.tagName);
    localStorage.setItem(storageKey, JSON.stringify(this));
  }

  getTagName() {
    return this.tagName;
  }

  getTabContent() {
    return this.tabContent;
  }

  rename(newTagName: string) {
    const newKey = Project.storageKey(newTagName);
    if (localStorage.getItem(newKey)) {
      console.error(`Project already exists: ${newTagName}`);
      return;
    }
    const oldKey = Project.storageKey(this.tagName);
    localStorage.setItem(oldKey, null);
    localStorage.setItem(newKey, JSON.stringify(this));
    this.tagName = newTagName;
  }

}