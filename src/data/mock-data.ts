
import { Resource, Category } from "@/types";

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Flask",
    url: "https://github.com/pallets/flask",
    description: "A microframework for Python based on Werkzeug, Jinja 2 and good intentions.",
    category: "Web Frameworks",
    subcategory: "Micro-Frameworks"
  },
  {
    id: "2",
    title: "Django",
    url: "https://github.com/django/django",
    description: "The Web framework for perfectionists with deadlines.",
    category: "Web Frameworks",
    subcategory: "Full-Stack Frameworks"
  },
  {
    id: "3",
    title: "FastAPI",
    url: "https://github.com/tiangolo/fastapi",
    description: "Modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.",
    category: "Web Frameworks",
    subcategory: "API Frameworks"
  },
  {
    id: "4",
    title: "Pandas",
    url: "https://github.com/pandas-dev/pandas",
    description: "Powerful data structures for data analysis, time series, and statistics.",
    category: "Data Science",
    subcategory: "Data Analysis"
  },
  {
    id: "5",
    title: "NumPy",
    url: "https://github.com/numpy/numpy",
    description: "The fundamental package for scientific computing with Python.",
    category: "Data Science",
    subcategory: "Scientific Computing"
  },
  {
    id: "6",
    title: "Scikit-learn",
    url: "https://github.com/scikit-learn/scikit-learn",
    description: "Machine Learning in Python.",
    category: "Data Science",
    subcategory: "Machine Learning"
  },
  {
    id: "7",
    title: "Pytest",
    url: "https://github.com/pytest-dev/pytest",
    description: "Simple and powerful testing with Python.",
    category: "Testing",
    subcategory: "Test Frameworks"
  },
  {
    id: "8",
    title: "Black",
    url: "https://github.com/psf/black",
    description: "The uncompromising Python code formatter.",
    category: "Development Tools",
    subcategory: "Code Formatters"
  },
  {
    id: "9",
    title: "Flake8",
    url: "https://github.com/PyCQA/flake8",
    description: "Tool for style guide enforcement.",
    category: "Development Tools",
    subcategory: "Linters"
  },
  {
    id: "10",
    title: "Poetry",
    url: "https://github.com/python-poetry/poetry",
    description: "Python packaging and dependency management made easy.",
    category: "Development Tools",
    subcategory: "Dependency Management"
  }
];

export const mockCategories: Category[] = [
  {
    id: "web-frameworks",
    name: "Web Frameworks",
    subcategories: [
      {
        id: "micro-frameworks",
        name: "Micro-Frameworks",
        resources: mockResources.filter(r => r.category === "Web Frameworks" && r.subcategory === "Micro-Frameworks")
      },
      {
        id: "full-stack-frameworks",
        name: "Full-Stack Frameworks",
        resources: mockResources.filter(r => r.category === "Web Frameworks" && r.subcategory === "Full-Stack Frameworks")
      },
      {
        id: "api-frameworks",
        name: "API Frameworks",
        resources: mockResources.filter(r => r.category === "Web Frameworks" && r.subcategory === "API Frameworks")
      }
    ],
    resources: mockResources.filter(r => r.category === "Web Frameworks")
  },
  {
    id: "data-science",
    name: "Data Science",
    subcategories: [
      {
        id: "data-analysis",
        name: "Data Analysis",
        resources: mockResources.filter(r => r.category === "Data Science" && r.subcategory === "Data Analysis")
      },
      {
        id: "scientific-computing",
        name: "Scientific Computing",
        resources: mockResources.filter(r => r.category === "Data Science" && r.subcategory === "Scientific Computing")
      },
      {
        id: "machine-learning",
        name: "Machine Learning",
        resources: mockResources.filter(r => r.category === "Data Science" && r.subcategory === "Machine Learning")
      }
    ],
    resources: mockResources.filter(r => r.category === "Data Science")
  },
  {
    id: "testing",
    name: "Testing",
    subcategories: [
      {
        id: "test-frameworks",
        name: "Test Frameworks",
        resources: mockResources.filter(r => r.category === "Testing" && r.subcategory === "Test Frameworks")
      }
    ],
    resources: mockResources.filter(r => r.category === "Testing")
  },
  {
    id: "development-tools",
    name: "Development Tools",
    subcategories: [
      {
        id: "code-formatters",
        name: "Code Formatters",
        resources: mockResources.filter(r => r.category === "Development Tools" && r.subcategory === "Code Formatters")
      },
      {
        id: "linters",
        name: "Linters",
        resources: mockResources.filter(r => r.category === "Development Tools" && r.subcategory === "Linters")
      },
      {
        id: "dependency-management",
        name: "Dependency Management",
        resources: mockResources.filter(r => r.category === "Development Tools" && r.subcategory === "Dependency Management")
      }
    ],
    resources: mockResources.filter(r => r.category === "Development Tools")
  }
];
