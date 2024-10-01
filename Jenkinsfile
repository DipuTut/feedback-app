pipeline {
    agent {
        kubernetes {
            label 'jenkins-docker-agent'
            yamlFile 'kubernetes_jenkins/jenkins-pod-template.yaml'
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
                    script {
                        docker.withRegistry('', 'dockerhub-token') {
                            sh 'docker push asadulhaque/feedback-app:pipeline-test'
                        }
                    }  
                }
                echo 'Push successful.'
            }
        }
        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying to kubernetes cluster...'
                container('kubectl') {
                    sh 'kubectl apply -f kubernetes/api-deployment.yaml'
                } 
                echo 'Deployment successful.'
            }
        }
    }   
}