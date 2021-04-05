import { PeerGroup } from "./peerGroup";
import { Project } from "./project";
import { TabCollection } from "./tabCollection";

export class ProjectList {
  private projects: Project[];
  private projectNames: string[];
  private allDiv: HTMLDivElement;
  private listDiv: HTMLDivElement;
  private peerGroup: PeerGroup;

  constructor(peerGroup: PeerGroup) {
    this.peerGroup = peerGroup;
    this.projects = [];
    this.projectNames = [];
    const body = document.getElementsByTagName('body')[0];
    this.allDiv = document.createElement('div');
    body.appendChild(this.allDiv);
    this.listDiv = document.createElement('div');
    this.allDiv.appendChild(this.listDiv);

    const emptyProject = document.createElement('div');
    emptyProject.classList.add('project');
    emptyProject.innerText = "New Project";
    this.allDiv.appendChild(emptyProject);
    emptyProject.addEventListener('click', (ev) => {
      const newProject = Project.newProject();
      this.projects.push(newProject);
      this.projectNames.push(newProject.getTagName());
      localStorage.setItem('symbiosis/list', JSON.stringify(this.projectNames));
      this.showProjects();
    })

    const listData = localStorage.getItem('symbiosis/list');
    if (listData) {
      const projectNames = JSON.parse(listData) as string[];
      for (const projectName of projectNames) {
        const project = Project.loadProject(projectName);
        this.projects.push(project);
      }
    } else {
      localStorage.setItem('symbiosis/list', "[]");
    }
    this.showProjects();
  }

  showProjects() {
    this.listDiv.innerText = "";
    for (const project of this.projects) {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project');
      projectDiv.innerText = project.getTagName();
      projectDiv.addEventListener('click',
        (ev) => { this.launchProject(project); });
      this.listDiv.appendChild(projectDiv);
    }
  }

  launchProject(project: Project) {
    this.allDiv.remove();
    const tc = new TabCollection(project, this.peerGroup);
  }
}