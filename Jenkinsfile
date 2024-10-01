pipeline {
    agent {
        kubernetes {
            label 'jenkins-docker-agent'
            defaultContainer 'jnlp'
            yaml """ 
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: slave
spec:
  containers:
  - name: docker
    image: docker:latest
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "250m"
    command:
    - cat
    tty: true    
    volumeMounts:
    - name: docker-socket
      mountPath: /var/run/docker.sock
  volumes:
  - hostPath:
      path: /var/run/docker.sock
    name: docker-socket            
"""

        }
    }

    triggers {
        pollSCM('H/2 * * * *')
    }
    
    environment {
        GITHUB_REPO = 'https://github.com/DipuTut/feedback-app.git'
    }
    
    stages {        
        stage('Checkout') {           
            steps {
                git url: "${GITHUB_REPO}", branch: 'main'
            }            
        }       
        stage('Docker Build') {   
            steps {
                echo 'Building the app...'
                container('docker') {
                    sh 'docker build -t asadulhaque90/feedback-app:pipeline-test .'
                }
                echo 'Build successful.'
            }    
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing the image to Docker Hub...'
                container('docker') {
                    sh 'docker push asadulhaque90/feedback-app:pipeline-test'
                }
                echo 'Push successful.'
            }
        }
        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying to kubernetes cluster...'
                sh 'kubectl apply -f kubernetes/api-deployment.yaml'
                echo 'Deployment successful.'
            }
        }
    }   
}